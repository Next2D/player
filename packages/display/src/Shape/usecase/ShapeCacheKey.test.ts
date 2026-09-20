import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { execute } from "./ShapeGenerateRenderQueueUseCase";

describe("Shape cache key lookup", () =>
{
    const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
    const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    const ids = new Set<string>();
    let savedBuffer: Float32Array;
    let savedOffset: number;
    let nextId = 900000;
    const makeShape = (): Shape => {
        const shape = new Shape();
        shape.graphics.beginFill(0x3399ff).drawRect(0, 0, 20, 30).endFill();
        shape.uniqueKey = `${nextId++}`;
        ids.add(shape.uniqueKey);
        return shape;
    };
    const draw = (shape: Shape, transform = color): Float32Array => {
        renderQueue.offset = 0;
        execute(shape, matrix, transform, 800, 600);
        return renderQueue.buffer.slice(0, renderQueue.offset);
    };
    beforeEach(() => {
        savedBuffer = renderQueue.buffer;
        savedOffset = renderQueue.offset;
        renderQueue.buffer = new Float32Array(4096);
        renderQueue.offset = 0;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        for (const id of ids) $cacheStore.removeById(id);
        ids.clear();
        renderQueue.buffer = savedBuffer;
        renderQueue.offset = savedOffset;
    });

    it("keeps misses and both store/map hits under the same string key", () =>
    {
        const shape = makeShape();
        const generate = vi.spyOn($cacheStore, "generateKeys");
        expect(draw(shape)[32]).toBe(0);
        expect($cacheStore.has(shape.uniqueKey, `${shape.cacheKey}`)).toBe(true);
        const storeHit = draw(shape);
        expect(storeHit[32]).toBe(1);
        expect(shape.$cache).not.toBeNull();
        const mapHit = draw(shape);
        expect(mapHit).toEqual(storeHit);
        expect(generate).toHaveBeenCalledTimes(1);
    });

    it("shares a key between shapes without mixing their content IDs", () =>
    {
        const first = makeShape();
        const second = makeShape();
        expect(draw(first)[32]).toBe(0);
        expect(draw(second)[32]).toBe(0);
        expect(first.cacheKey).toBe(second.cacheKey);
        expect(draw(first)[32]).toBe(1);
        expect(draw(second)[32]).toBe(1);
    });

    it("tracks scale and alpha-offset changes while retaining translation hits", () =>
    {
        const shape = makeShape();
        draw(shape);
        const originalKey = shape.cacheKey;
        shape.x = 20;
        shape.rotation = 45;
        expect(draw(shape)[32]).toBe(1);
        expect(shape.cacheKey).toBe(originalKey);
        shape.scaleX = 2;
        expect(draw(shape)[32]).toBe(0);
        expect(shape.cacheKey).not.toBe(originalKey);
        const scaledKey = shape.cacheKey;
        const transformed = color.slice();
        transformed[7] = 12;
        expect(draw(shape, transformed)[32]).toBe(0);
        expect(shape.cacheKey).not.toBe(scaledKey);
        expect(draw(shape)[32]).toBe(1);
        expect(shape.cacheKey).toBe(scaledKey);
    });

    it("preserves cacheAsBitmap's existing alpha-offset-independent key", () =>
    {
        const shape = makeShape();
        shape.cacheAsBitmap = new Matrix();
        draw(shape);
        const key = shape.cacheKey;
        const transformed = color.slice();
        transformed[7] = 20;
        expect(draw(shape, transformed)[32]).toBe(1);
        expect(shape.cacheKey).toBe(key);
    });

    it("uses zero for bitmap lookup even after a different vector key", () =>
    {
        draw(makeShape());
        const shape = new Shape();
        shape.setBitmapBuffer(2, 2, new Uint8Array(16).fill(255));
        shape.uniqueKey = `${nextId++}`;
        ids.add(shape.uniqueKey);
        const miss = draw(shape);
        expect(miss[28]).toBe(0);
        expect(miss[32]).toBe(0);
        expect($cacheStore.has(shape.uniqueKey, "0")).toBe(true);
        expect(draw(shape)[32]).toBe(1);
    });

    it("invalidates a retained map when removed, including after pool reuse", () =>
    {
        const first = makeShape();
        draw(first);
        draw(first);
        const staleMap = first.$cache;
        $cacheStore.removeById(first.uniqueKey);
        const second = makeShape();
        draw(second);
        expect($cacheStore.getById(second.uniqueKey)).toBe(staleMap);
        expect(draw(first)[32]).toBe(0);
        expect(draw(first)[32]).toBe(1);
    });

    it("keeps an outer miss's lookup key when its graphics getter re-enters", () =>
    {
        const outer = makeShape();
        const nested = makeShape();
        nested.scaleX = 2;
        const buffer = outer.graphics.buffer;
        const set = vi.spyOn($cacheStore, "set");
        vi.spyOn(outer.graphics, "buffer", "get").mockImplementation(() => {
            execute(nested, matrix, color, 800, 600);
            return buffer;
        });
        draw(outer);
        expect(outer.cacheKey).not.toBe(nested.cacheKey);
        expect(set).toHaveBeenCalledWith(outer.uniqueKey, `${outer.cacheKey}`, true);
        expect(set).toHaveBeenCalledWith(nested.uniqueKey, `${nested.cacheKey}`, true);
        expect($cacheStore.has(outer.uniqueKey, `${nested.cacheKey}`)).toBe(false);
    });

    it("respects externally changed numeric keys and alternating lookup strings", () =>
    {
        const shape = makeShape();
        draw(shape);
        for (const key of [123, 456, 123, -1, Infinity, -Infinity, 123]) {
            shape.cacheKey = key;
            const get = vi.spyOn($cacheStore, "get");
            shape.$cache = null;
            draw(shape);
            expect(get).toHaveBeenLastCalledWith(shape.uniqueKey, `${key}`);
            get.mockRestore();
        }
    });
});
