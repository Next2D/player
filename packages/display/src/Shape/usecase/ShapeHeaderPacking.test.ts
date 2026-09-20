import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { execute } from "./ShapeGenerateRenderQueueUseCase";
import { execute as calcBounds } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { $poolBoundsArray, $RENDERER_SHAPE_TYPE } from "../../DisplayObjectUtil";

describe("Shape header packing contract", () =>
{
    let savedBuffer: Float32Array;
    let savedOffset: number;
    const shapes: Shape[] = [];
    const bits = (values: Float32Array): Uint32Array => new Uint32Array(values.buffer, values.byteOffset, values.length);
    const makeShape = (): Shape => {
        const shape = new Shape();
        shape.graphics.beginFill(0x336699).drawRect(-4, -5, 8, 10).endFill();
        shapes.push(shape);
        return shape;
    };
    beforeEach(() => {
        savedBuffer = renderQueue.buffer;
        savedOffset = renderQueue.offset;
        renderQueue.buffer = new Float32Array(4096);
        renderQueue.offset = 0;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        for (const shape of shapes) if (shape.uniqueKey) $cacheStore.removeById(shape.uniqueKey);
        shapes.length = 0;
        renderQueue.buffer = savedBuffer;
        renderQueue.offset = savedOffset;
    });

    it("matches all 32 fields through randomized transforms, colors and cache hits", () =>
    {
        const shape = makeShape();
        let seed = 7261;
        const random = (): number => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 0x100000000;
        };
        for (let index = 0; index < 1000; index++) {
            const matrix = new Float32Array([random() * 4 - 2, random(), -random(), random() * 4 - 2, 100, 100]);
            const color = new Float32Array([random(), random(), random(), 1, random() * 255, -0, 1e-45, 0]);
            if (index % 5 === 0) color[0] = NaN;
            if (index % 7 === 0) color[1] = Infinity;
            if (index % 11 === 0) color[2] = -Infinity;
            const g = shape.graphics;
            const bounds = calcBounds(g.xMin, g.yMin, g.xMax, g.yMax, matrix);
            const expectedBounds = bounds.slice();
            $poolBoundsArray(bounds);
            const xScale = Math.sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1]);
            const yScale = Math.sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3]);
            renderQueue.offset = 3;
            renderQueue.buffer.fill(-99);
            execute(shape, matrix, color, 800, 600);
            const expected = new Float32Array([
                1, $RENDERER_SHAPE_TYPE, ...matrix, ...color, ...expectedBounds,
                g.xMin, g.yMin, g.xMax, g.yMax,
                0, 1, 0, +shape.uniqueKey,
                $cacheStore.generateKeys(Math.round(xScale * 100) / 100, Math.round(yScale * 100) / 100, 0),
                xScale, yScale, shape.instanceId
            ]);
            expect(bits(renderQueue.buffer.subarray(3, 35))).toEqual(bits(expected));
            expect(renderQueue.buffer.subarray(0, 3)).toEqual(new Float32Array(3).fill(-99));
            const end = renderQueue.offset;
            expect(renderQueue.buffer[end]).toBe(-99);
            renderQueue.offset = 3;
            execute(shape, matrix, color, 800, 600);
            expect(bits(renderQueue.buffer.subarray(3, 35))).toEqual(bits(expected));
            expect(renderQueue.buffer[35]).toBe(1);
        }
    });

    it("preserves capacity growth and nonzero byte offsets", () =>
    {
        const shape = makeShape();
        const matrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        execute(shape, matrix, color, 800, 600);
        renderQueue.offset = 0;
        execute(shape, matrix, color, 800, 600);
        const expected = renderQueue.buffer.slice(0, renderQueue.offset);
        for (const capacity of [0, 31, 32, expected.length, 128]) {
            const storage = new Float32Array(capacity + 10).fill(-123);
            renderQueue.buffer = storage.subarray(5, 5 + capacity);
            renderQueue.offset = 0;
            execute(shape, matrix, color, 800, 600);
            expect(renderQueue.offset).toBe(expected.length);
            expect(bits(renderQueue.buffer.subarray(0, expected.length))).toEqual(bits(expected));
            expect(storage.subarray(0, 5)).toEqual(new Float32Array(5).fill(-123));
            expect(storage.subarray(5 + capacity)).toEqual(new Float32Array(5).fill(-123));
        }
    });

    it("keeps pre-getter transform values and appends after a nested draw", () =>
    {
        const outer = makeShape();
        const nested = makeShape();
        const matrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const color = new Float32Array([1, 0.5, 0.25, 1, 0, 0, 0, 0]);
        const originalMatrix = matrix.slice();
        const originalColor = color.slice();
        const id = outer.instanceId;
        let offset = -1;
        Object.defineProperty(outer, "instanceId", { get: () => {
            matrix[0] = 2;
            color[0] = 0.25;
            execute(nested, matrix, color, 800, 600);
            offset = renderQueue.offset;
            return id;
        } });
        execute(outer, matrix, color, 800, 600);
        expect(offset).toBeGreaterThan(32);
        expect(bits(renderQueue.buffer.subarray(offset + 2, offset + 8))).toEqual(bits(originalMatrix));
        expect(bits(renderQueue.buffer.subarray(offset + 8, offset + 16))).toEqual(bits(originalColor));
        expect(renderQueue.buffer[offset + 31]).toBe(id);
    });

    it("applies cacheAsBitmap scales before Float32 rounding", () =>
    {
        const shape = makeShape();
        shape.cacheAsBitmap = new Matrix(1.234567, 0, 0, 0.7654321);
        const matrix = new Float32Array([1.1, -0.2, 0.3, 0.9, 100, 100]);
        execute(shape, matrix, new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]), 800, 600);
        const raw = shape.cacheAsBitmap.rawData;
        const sx = Math.sqrt(raw[0] * raw[0] + raw[1] * raw[1]);
        const sy = Math.sqrt(raw[2] * raw[2] + raw[3] * raw[3]);
        expect(bits(renderQueue.buffer.subarray(2, 8))).toEqual(bits(new Float32Array([
            matrix[0] * sx, matrix[1] * sx, matrix[2] * sy, matrix[3] * sy, matrix[4], matrix[5]
        ])));
        expect(renderQueue.buffer[26]).toBe(2);
    });

    it("leaves existing queue contents intact when header allocation fails", () =>
    {
        const shape = makeShape();
        const original = new Float32Array([11, 22]);
        renderQueue.buffer = original;
        renderQueue.offset = 2;
        vi.spyOn(renderQueue, "resize").mockImplementation(() => { throw new Error("allocation failed"); });
        expect(() => execute(shape, new Float32Array([1, 0, 0, 1, 100, 100]),
            new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]), 800, 600)).toThrow("allocation failed");
        expect(renderQueue.offset).toBe(2);
        expect(renderQueue.buffer).toBe(original);
        expect(original).toEqual(new Float32Array([11, 22]));
    });
});
