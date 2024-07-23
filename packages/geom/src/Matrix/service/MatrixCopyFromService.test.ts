import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js copyFrom", () =>
{
    it("copy test case1", () =>
    {
        const matrix1 = new Matrix();
        expect(matrix1.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=0, ty=0)"
        );

        const matrix2 = new Matrix(1, 2, 3, 4, 5, 6);
        matrix1.copyFrom(matrix2);
        expect(matrix1.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

        matrix1.a  = 1;
        matrix1.b  = 0;
        matrix1.c  = 0;
        matrix1.d  = 1;
        matrix1.tx = 100;
        matrix1.ty = 200;
        expect(matrix1.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=100, ty=200)"
        );

        expect(matrix2.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );
    });
});