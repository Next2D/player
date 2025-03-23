import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js scale test", () =>
{
    it("scale test case1", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 2);

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(1);
        expect(matrix.c).toBe(-1);
        expect(matrix.d).toBe(2);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);
    });

    it("scale test case2", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 3);

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(1.5);
        expect(matrix.c).toBe(-1);
        expect(matrix.d).toBe(3);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);
    });

    it("scale test case3", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(3, 2);

        expect(matrix.a).toBe(3);
        expect(matrix.b).toBe(1);
        expect(matrix.c).toBe(-1.5);
        expect(matrix.d).toBe(2);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);
    });

    it("scale test case4", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 10, 0);
        matrix.scale(-1, 2);

        expect(matrix.a).toBe(-1);
        expect(matrix.b).toBe(1);
        expect(matrix.c).toBe(0.5);
        expect(matrix.d).toBe(2);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(0);
    });

    it("scale test case5", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
        matrix.scale(3, -2);
        expect(matrix.a).toBe(3);
        expect(matrix.b).toBe(-1);
        expect(matrix.c).toBe(-1.5);
        expect(matrix.d).toBe(-2);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(-20);
    });
});