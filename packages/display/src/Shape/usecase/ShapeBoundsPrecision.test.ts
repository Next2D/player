import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Shape } from "../../Shape";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { execute } from "./ShapeGenerateRenderQueueUseCase";
import { execute as calcBounds } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";

describe("Shape bounds precision before culling", () =>
{
    let savedBuffer: Float32Array;
    let savedOffset: number;
    let shape: Shape;
    const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    const bits = (values: Float32Array): Uint32Array => new Uint32Array(
        values.buffer, values.byteOffset, values.length
    );
    beforeEach(() => {
        savedBuffer = renderQueue.buffer;
        savedOffset = renderQueue.offset;
        renderQueue.buffer = new Float32Array(4096);
        renderQueue.offset = 0;
        shape = new Shape();
        shape.graphics.beginFill(0x336699).drawRect(0, 0, 10, 10).endFill();
        // Isolate transformed bounds from the earlier graphics-local drawable check.
        vi.spyOn(shape.graphics, "isDrawable", "get").mockReturnValue(true);
        shape.uniqueKey = `${shape.instanceId}`;
    });
    afterEach(() => {
        vi.restoreAllMocks();
        $cacheStore.removeById(shape.uniqueKey);
        renderQueue.buffer = savedBuffer;
        renderQueue.offset = savedOffset;
    });
    const check = (rect: number[], matrix: Float32Array, viewport = 800): boolean => {
        const g = shape.graphics;
        [g.xMin, g.yMin, g.xMax, g.yMax] = rect;
        const expected = calcBounds(...rect as [number, number, number, number], matrix, new Float32Array(4));
        const width = Math.ceil(Math.abs(expected[2] - expected[0]));
        const height = Math.ceil(Math.abs(expected[3] - expected[1]));
        const culled = width === 0 || height === 0 || width === Infinity || height === Infinity
            || expected[0] + width < 0 || expected[1] + height < 0
            || expected[0] > viewport || expected[1] > viewport;
        renderQueue.offset = 0;
        execute(shape, matrix, color, viewport, viewport);
        expect(renderQueue.buffer[0]).toBe(culled ? 0 : 1);
        if (culled) {
            expect(renderQueue.offset).toBe(1);
        } else {
            expect(bits(renderQueue.buffer.subarray(16, 20))).toEqual(bits(expected));
        }
        return culled;
    };

    it("matches reference bounds and culling for 3000 random affine transforms and reversed bounds", () =>
    {
        let seed = 8137;
        const random = (): number => {
            seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
            return seed / 0x100000000;
        };
        for (let index = 0; index < 3000; index++) {
            check(Array.from({ length: 4 }, () => random() * 200 - 100),
                new Float32Array([
                    random() * 4 - 2, random() * 4 - 2,
                    random() * 4 - 2, random() * 4 - 2,
                    random() * 1200 - 200, random() * 1200 - 200
                ]));
        }
    });

    it("preserves signed zero, subnormal, overflow and nonfinite results", () =>
    {
        const values = [-0, 0, 2 ** -149, -(2 ** -149), 2 ** -150,
            1e-30, -1e-30, 1e30, -1e30, 3.4028234663852886e38,
            Number.MAX_VALUE, Infinity, -Infinity, NaN];
        for (const value of values) {
            for (let field = 0; field < 6; field++) {
                const matrix = new Float32Array([1, 0, 0, 1, 100, 100]);
                matrix[field] = value;
                check([-4, -5, 4, 5], matrix);
            }
            for (let field = 0; field < 4; field++) {
                const rect = [-4, -5, 4, 5];
                rect[field] = value;
                check(rect, new Float32Array([1, -0, -0, 1, -0, -0]));
            }
        }
    });

    it("rounds before viewport edge and collapsed-width decisions", () =>
    {
        const identity = new Float32Array([1, 0, 0, 1, 0, 0]);
        expect(check([800 + 2 ** -16, 0, 810, 10], identity)).toBe(false);
        expect(check([800 + 2 ** -14, 0, 810, 10], identity)).toBe(true);
        expect(check([100, 0, 100 + 2 ** -19, 10], identity)).toBe(true);
        expect(check([100, 0, 100 + 2 ** -16, 10], identity)).toBe(false);
        expect(check([-10 - 2 ** -22, 0, -(2 ** -24), 10], identity)).toBe(false);
    });

    it("reads all graphics bounds in order before reading a matrix mutated by the last getter", () =>
    {
        const g = shape.graphics;
        const rect = [g.xMin, g.yMin, g.xMax, g.yMax];
        const names = ["xMin", "yMin", "xMax", "yMax"] as const;
        const reads: string[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        for (const [index, name] of names.entries()) {
            Object.defineProperty(g, name, { configurable: true, get: () => {
                reads.push(name);
                if (name === "yMax") {
                    matrix[0] = 1.25;
                    matrix[4] = 100;
                }
                return rect[index];
            } });
        }
        execute(shape, matrix, color, 800, 600);
        const expected = calcBounds(...rect as [number, number, number, number], matrix, new Float32Array(4));
        expect(reads.slice(0, 4)).toEqual(names);
        expect(bits(renderQueue.buffer.subarray(16, 20))).toEqual(bits(expected));
    });
});
