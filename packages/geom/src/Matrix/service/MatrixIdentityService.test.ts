import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js identity", () =>
{
    it("identity test case1", () =>
    {
        const matrix = new Matrix(1, 2, 3, 4, 5, 6);
        expect(matrix.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

        matrix.identity();
        expect(matrix.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=0, ty=0)"
        );
    });
});