import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js copyFrom", () =>
{
    it("copy test case1", () =>
    {
        const matrix1 = new Matrix();

        expect(matrix1.a).toBe(1);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(0);
        expect(matrix1.d).toBe(1);
        expect(matrix1.tx).toBe(0);
        expect(matrix1.ty).toBe(0);

        const matrix2 = new Matrix(1, 2, 3, 4, 5, 6);
        matrix1.copyFrom(matrix2);

        expect(matrix1.a).toBe(1);
        expect(matrix1.b).toBe(2);
        expect(matrix1.c).toBe(3);
        expect(matrix1.d).toBe(4);
        expect(matrix1.tx).toBe(5);
        expect(matrix1.ty).toBe(6);

        matrix1.a  = 1;
        matrix1.b  = 0;
        matrix1.c  = 0;
        matrix1.d  = 1;
        matrix1.tx = 100;
        matrix1.ty = 200;

        expect(matrix1.a).toBe(1);
        expect(matrix1.b).toBe(0);
        expect(matrix1.c).toBe(0);
        expect(matrix1.d).toBe(1);
        expect(matrix1.tx).toBe(100);
        expect(matrix1.ty).toBe(200);

        expect(matrix2.a).toBe(1);
        expect(matrix2.b).toBe(2);
        expect(matrix2.c).toBe(3);
        expect(matrix2.d).toBe(4);
        expect(matrix2.tx).toBe(5);
        expect(matrix2.ty).toBe(6);
    });
});