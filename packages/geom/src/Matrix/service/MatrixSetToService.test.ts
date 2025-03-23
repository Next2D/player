import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js setTo", () =>
{
    it("copy test case1", () =>
    {

        const matrix = new Matrix();

        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(0);
        expect(matrix.c).toBe(0);
        expect(matrix.d).toBe(1);
        expect(matrix.tx).toBe(0);
        expect(matrix.ty).toBe(0);

        matrix.setTo(1, 2, 3, 4, 5, 6);
        expect(matrix.a).toBe(1);
        expect(matrix.b).toBe(2);
        expect(matrix.c).toBe(3);
        expect(matrix.d).toBe(4);
        expect(matrix.tx).toBe(5);
        expect(matrix.ty).toBe(6);
    });
});