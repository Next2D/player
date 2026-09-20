import { execute } from "./DisplayObjectCalcBoundsMatrixService";
import { describe, expect, it } from "vitest";
import { $poolBoundsArray } from "../../DisplayObjectUtil";

describe("DisplayObjectCalcBoundsMatrixService.js test", () =>
{
    it("execute test case1", () =>
    {
        const bounds = execute(-10, -20, 100, 200, new Float32Array([1, 0, 0, 1, 0, 0]));
        expect(bounds[0]).toBe(-10);
        expect(bounds[1]).toBe(-20);
        expect(bounds[2]).toBe(100);
        expect(bounds[3]).toBe(200);
        
    });

    it("execute test case2", () =>
    {
        const bounds = execute(-10, -20, 100, 200, new Float32Array([1.2, 0.34, -0.023, 0.3, 20, 40]));
        expect(bounds[0]).toBe(3.3999996185302734);
        expect(bounds[1]).toBe(30.600000381469727);
        expect(bounds[2]).toBe(140.4600067138672);
        expect(bounds[3]).toBe(134);
    });
});

describe("caller-owned bounds output", () =>
{
    const bits = (array: Float32Array): Uint32Array => new Uint32Array(
        array.buffer, array.byteOffset, array.length
    );

    it.each([
        [1, 0, 0, 1, 0, 0],
        [1.2, 0.34, -0.023, 0.3, 20, 40],
        [-2, 0.7, 0.4, -3, -10, 12],
        [0, 1, -1, 0, 0, 0],
        [-0, -0, -0, -0, -0, -0],
        [1e-40, 1e-38, -1e-40, 1e-38, 1e-40, -1e-40],
        [1e38, 0, 0, 1e38, 1e38, -1e38],
        [NaN, 0, 0, 1, 0, 0],
        [Infinity, 0, 0, -Infinity, 0, 0]
    ])("matches pooled Float32 bits for matrix %j", (...values: number[]) =>
    {
        const matrix = new Float32Array(values);
        const originalMatrix = matrix.slice();
        const expected = execute(-10.125, -20.375, 100.875, 200.125, matrix);
        const storage = new Float32Array(12).fill(123.5);
        const output = storage.subarray(3, 7);

        expect(execute(-10.125, -20.375, 100.875, 200.125, matrix, output)).toBe(output);
        expect(bits(output)).toEqual(bits(expected));
        expect(bits(matrix)).toEqual(bits(originalMatrix));
        expect(storage.slice(0, 3)).toEqual(new Float32Array(3).fill(123.5));
        expect(storage.slice(7)).toEqual(new Float32Array(5).fill(123.5));
        $poolBoundsArray(expected);
    });

    it("matches pooled results through 2,000 repeated writes, including reversed bounds", () =>
    {
        const output = new Float32Array(4);
        let state = 12345;
        const random = (): number => {
            state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
            return (state / 4294967296 - 0.5) * 1000;
        };
        for (let index = 0; index < 2000; index++) {
            const matrix = new Float32Array(Array.from({ "length": 6 }, random));
            const x0 = random(), y0 = random(), x1 = random(), y1 = random();
            const expected = execute(x0, y0, x1, y1, matrix);
            execute(x0, y0, x1, y1, matrix, output);
            expect(bits(output)).toEqual(bits(expected));
            $poolBoundsArray(expected);
        }
    });

    it("reads all matrix components before writing an overlapping output", () =>
    {
        const matrix = new Float32Array([1.2, 0.34, -0.023, 0.3, 20, 40]);
        const expected = execute(-10, -20, 100, 200, matrix);
        const output = matrix.subarray(2, 6);
        execute(-10, -20, 100, 200, matrix, output);
        expect(bits(output)).toEqual(bits(expected));
        $poolBoundsArray(expected);
    });

    it("does not give caller-owned output to subsequent pooled callers", () =>
    {
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const output = new Float32Array(4);
        execute(1, 2, 3, 4, matrix, output);
        const pooled = execute(5, 6, 7, 8, matrix);
        expect(pooled).not.toBe(output);
        expect(output).toEqual(new Float32Array([1, 2, 3, 4]));
        $poolBoundsArray(pooled);
    });
});
