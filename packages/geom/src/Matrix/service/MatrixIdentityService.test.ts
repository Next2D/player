import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js identity", () =>
{
    it("identity test case1", () =>
    {
        const matrix = new Matrix(1, 2, 3, 4, 5, 6);

        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(2);
        expect(matrix.c).toBe(3);
        expect(matrix.d).toBe(4);
        expect(matrix.tx).toBe(5);
        expect(matrix.ty).toBe(6);

        matrix.identity();
        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);
    });
});