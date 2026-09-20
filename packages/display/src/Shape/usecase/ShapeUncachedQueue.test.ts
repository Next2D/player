import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Shape } from "../../Shape";
import { Sprite } from "../../Sprite";
import { stage } from "../../Stage";
import { Matrix, Rectangle } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { execute } from "./ShapeGenerateRenderQueueUseCase";

describe("uncached Shape queue contract", () =>
{
    let savedBuffer: Float32Array;
    let savedOffset: number;
    let savedScale: number;
    const shapes: Shape[] = [];
    const identity = new Float32Array([1, 0, 0, 1, 0, 0]);
    const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    const bits = (data: Float32Array): Uint32Array => new Uint32Array(data.buffer, data.byteOffset, data.length);
    const makeShape = (): Shape => {
        const shape = new Shape();
        shape.graphics.beginFill(0x336699).drawRect(0, 0, 10, 10).endFill();
        shape.uniqueKey = `${shape.instanceId}`;
        shapes.push(shape);
        return shape;
    };
    const draw = (shape: Shape): void => execute(shape, identity, color, 800, 600);
    beforeEach(() => {
        savedBuffer = renderQueue.buffer;
        savedOffset = renderQueue.offset;
        savedScale = stage.rendererScale;
        stage.rendererScale = 1;
        renderQueue.buffer = new Float32Array(33);
        renderQueue.offset = 0;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        for (const shape of shapes) $cacheStore.removeById(shape.uniqueKey);
        shapes.length = 0;
        renderQueue.buffer = savedBuffer;
        renderQueue.offset = savedOffset;
        stage.rendererScale = savedScale;
    });

    it("writes vector payload through growth, then hits and invalidates the cache", () =>
    {
        const shape = makeShape();
        const payload = shape.graphics.buffer.slice();
        draw(shape);
        expect(renderQueue.buffer[32]).toBe(0);
        expect(renderQueue.buffer[33]).toBe(payload.length);
        expect(bits(renderQueue.buffer.subarray(34, 34 + payload.length))).toEqual(bits(payload));
        expect(renderQueue.buffer.subarray(34 + payload.length, renderQueue.offset)).toEqual(new Float32Array([11, 0]));
        expect($cacheStore.get(shape.uniqueKey, `${shape.cacheKey}`)).toBe(true);
        renderQueue.offset = 0;
        draw(shape);
        expect(renderQueue.offset).toBe(35);
        expect(renderQueue.buffer.subarray(32, 35)).toEqual(new Float32Array([1, 11, 0]));
        expect(shape.$cache).not.toBeNull();
        $cacheStore.removeById(shape.uniqueKey);
        renderQueue.offset = 0;
        draw(shape);
        expect(renderQueue.buffer[32]).toBe(0);
        expect(bits(renderQueue.buffer.subarray(34, 34 + payload.length))).toEqual(bits(payload));
        expect(shape.$cache).toBeNull();
    });

    it("packs bitmap bytes with a non-aligned source offset without float conversion", () =>
    {
        const shape = makeShape();
        shape.isBitmap = true;
        vi.spyOn(shape.graphics, "isDrawable", "get").mockReturnValue(false);
        const pixels = new Uint8Array(23).subarray(3, 19);
        pixels.set([0, 0, 128, 127, 255, 255, 255, 255, 0, 0, 0, 128, 1, 2, 3, 4]);
        shape.$bitmapBuffer = pixels;
        draw(shape);
        expect(renderQueue.buffer[32]).toBe(0);
        expect(renderQueue.buffer[33]).toBe(16);
        expect(new Uint8Array(renderQueue.buffer.buffer, renderQueue.buffer.byteOffset + 34 * 4, 16)).toEqual(pixels);
        expect(renderQueue.offset).toBe(40);
        expect($cacheStore.get(shape.uniqueKey, "0")).toBe(true);
    });

    it("writes the 24-float scale9Grid payload before vector data", () =>
    {
        const shape = makeShape();
        const parent = new Sprite();
        parent.addChild(shape);
        shape.matrix = new Matrix(2, 0, 0, 2, 100, 100);
        shape.scale9Grid = new Rectangle(2, 2, 6, 6);
        const payload = shape.graphics.buffer.slice();
        draw(shape);
        expect(renderQueue.buffer[24]).toBe(1);
        expect(renderQueue.buffer[32]).toBe(0);
        const expected = new Float32Array([
            2, 0, 0, 2, 100, 100,
            1, 0, 0, 1, -100, -100,
            100, 100, 20, 20,
            0.2, 0.2, 0.1, 0.1,
            0.8, 0.8, 0.9, 0.9
        ]);
        expect(bits(renderQueue.buffer.subarray(33, 57))).toEqual(bits(expected));
        expect(renderQueue.buffer[57]).toBe(payload.length);
        expect(bits(renderQueue.buffer.subarray(58, 58 + payload.length))).toEqual(bits(payload));
    });

    it("does not register a cache entry if writing the payload fails", () =>
    {
        const shape = makeShape();
        const failure = new Error("payload failure");
        vi.spyOn(renderQueue, "set").mockImplementation(() => { throw failure; });
        expect(() => draw(shape)).toThrow(failure);
        expect(renderQueue.offset).toBe(34);
        expect($cacheStore.get(shape.uniqueKey, `${shape.cacheKey}`)).toBeNull();
    });
});
