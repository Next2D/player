import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js concat test", () =>
{
    it("concat test case1", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-17.5)"
        );
    });

    it("concat test case2", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(0, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=0, b=0, c=0, d=-2.25, tx=10, ty=-17.5)"
        );
    });

    it("concat test case3", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=2.5999999046325684, b=-1.5, c=-1.2999999523162842, d=-1.5, tx=10, ty=-17.5)"
        );
    });

    it("concat test case4", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, 0, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=2.5999999046325684, b=1.5, c=-1.2999999523162842, d=-0.75, tx=10, ty=-10)"
        );
    });

    it("concat test case5", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 0, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=0, ty=-17.5)"
        );
    });

    it("concat test case6", () =>
    {
        const matrix1 = new Matrix(2, 1, -1, 1, 0, 5);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, 0);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-7.5)"
        );
    });

    it("concat test case7", () =>
    {
        const matrix1 = new Matrix(1,0,0,1,0,0);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=10, ty=-10)"
        );
    });

    it("concat test case8", () =>
    {
        const matrix1 = new Matrix(1,0,0,1,10,10);
        const matrix2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        matrix1.concat(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=23, ty=-17.5)"
        );
    });
});