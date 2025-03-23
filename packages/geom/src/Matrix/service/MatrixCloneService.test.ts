import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js property valid test and clone test", () =>
{
    it("property success case1", () =>
    {
        const matrix = new Matrix();
        matrix.a   = 1.2;
        matrix.b   = 0.765;
        matrix.c   = -0.872;
        matrix.d   = -1.5;
        matrix.tx  = 10;
        matrix.ty  = -10;

        expect(matrix.a).toBe(1.2000000476837158);
        expect(matrix.b).toBe(0.7649999856948853);
        expect(matrix.c).toBe(-0.871999979019165);
        expect(matrix.d).toBe(-1.5);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(-10);
    });
});