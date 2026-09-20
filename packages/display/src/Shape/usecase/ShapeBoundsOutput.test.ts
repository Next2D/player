import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Shape } from "../../Shape";
import { Matrix } from "@next2d/geom";
import { renderQueue } from "@next2d/render-queue";
import { $cacheStore } from "@next2d/cache";
import { execute } from "./ShapeGenerateRenderQueueUseCase";
import { execute as getRawMatrix } from "../../DisplayObject/usecase/DisplayObjectGetRawMatrixUseCase";
import { execute as calcBounds } from "../../DisplayObject/service/DisplayObjectCalcBoundsMatrixService";
import { $poolBoundsArray } from "../../DisplayObjectUtil";

describe("Shape bounds output lifetime", () =>
{
    let savedBuffer: Float32Array;
    let savedOffset: number;
    const shapes: Shape[] = [];
    const color = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
    const parent = new Float32Array([1.1, 0.2, -0.1, 0.9, 30, 40]);
    const bits = (values: Float32Array): Uint32Array => new Uint32Array(
        values.buffer, values.byteOffset, values.length
    );
    const makeShape = (x: number, rotation: number): Shape => {
        const shape = new Shape();
        shape.graphics.beginFill(0xff00ff).drawRect(-10, -20, 40, 60).endFill();
        shape.x = x;
        shape.y = 60;
        shape.rotation = rotation;
        shapes.push(shape);
        return shape;
    };
    const expectedBounds = (shape: Shape): Float32Array => {
        const matrix = Matrix.multiply(parent, getRawMatrix(shape) as Float32Array);
        const g = shape.graphics;
        const bounds = calcBounds(g.xMin, g.yMin, g.xMax, g.yMax, matrix);
        const result = bounds.slice();
        $poolBoundsArray(bounds);
        Matrix.release(matrix);
        return result;
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

    it("keeps each header's rounded bounds on consecutive cache misses and hits", () =>
    {
        const first = makeShape(20, 23);
        const second = makeShape(180, -47);
        const expected = [expectedBounds(first), expectedBounds(second)];
        for (let pass = 0; pass < 3; pass++) {
            for (const [index, shape] of [first, second].entries()) {
                const offset = renderQueue.offset;
                execute(shape, parent, color, 800, 600);
                expect(renderQueue.buffer[offset]).toBe(1);
                expect(bits(renderQueue.buffer.subarray(offset + 16, offset + 20))).toEqual(bits(expected[index]));
            }
        }
    });

    it("copies outer bounds before a getter re-enters Shape queue generation", () =>
    {
        const outer = makeShape(20, 23);
        const nested = makeShape(180, -47);
        const expected = expectedBounds(outer);
        const expectedMatrix = Matrix.multiply(parent, getRawMatrix(outer) as Float32Array);
        let outerHeaderOffset = -1;
        vi.spyOn(outer, "scale9Grid", "get").mockImplementation(() => {
            execute(nested, parent, color, 800, 600);
            outerHeaderOffset = renderQueue.offset;
            return null;
        });
        execute(outer, parent, color, 800, 600);
        expect(outerHeaderOffset).toBeGreaterThan(32);
        expect(renderQueue.buffer[0]).toBe(1);
        const outerHeader = renderQueue.buffer.subarray(outerHeaderOffset, outerHeaderOffset + 32);
        expect(bits(outerHeader.subarray(2, 8))).toEqual(bits(expectedMatrix));
        expect(bits(outerHeader.subarray(16, 20))).toEqual(bits(expected));
        Matrix.release(expectedMatrix);
    });
});
