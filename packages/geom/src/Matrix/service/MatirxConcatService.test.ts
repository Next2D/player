import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js concat test", () =>
{
    it("concat test case1", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(2.5999999046325684);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(-1.2999999523162842);
        expect(matrix1.d).toBe(-2.25);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-17.5);
    });

    it("concat test case2", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(0, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(0);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(0);
        expect(matrix1.d).toBe(-2.25);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-17.5);
    });

    it("concat test case3", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(2.5999999046325684);
        expect(matrix1.b).toBe(-1.5);
        expect(matrix1.c).toBe(-1.2999999523162842);
        expect(matrix1.d).toBe(-1.5);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-17.5);
    });

    it("concat test case4", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, 0, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(2.5999999046325684);
        expect(matrix1.b).toBe(1.5);
        expect(matrix1.c).toBe(-1.2999999523162842);
        expect(matrix1.d).toBe(-0.75);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-10);
    });

    it("concat test case5", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 0, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(2.5999999046325684);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(-1.2999999523162842);
        expect(matrix1.d).toBe(-2.25);
        expect(matrix1.tx).toBe(0);
        expect(matrix1.ty).toBe(-17.5);
    });

    it("concat test case6", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, 0);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(2.5999999046325684);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(-1.2999999523162842);
        expect(matrix1.d).toBe(-2.25);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-7.5);
    });

    it("concat test case7", () =>
    {
        const matrix1 = new Matrix(1,0,0,1,0,0);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(1.2999999523162842);
        expect(matrix1.b).toBe(0.75);
        expect(matrix1.c).toBe(0);
        expect(matrix1.d).toBe(-1.5);
        expect(matrix1.tx).toBe(10);
        expect(matrix1.ty).toBe(-10);
    });

    it("concat test case8", () =>
    {
        const matrix1 = new Matrix(1,0,0,1,10,10);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);

        expect(matrix1.a).toBe(1.2999999523162842);
        expect(matrix1.b).toBe(0.75);
        expect(matrix1.c).toBe(0);
        expect(matrix1.d).toBe(-1.5);
        expect(matrix1.tx).toBe(23);
        expect(matrix1.ty).toBe(-17.5);
    });
});