import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js scale test", () =>
{
    it("scale test case1", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 2);
        expect(matrix.toString()).toBe("(a=2, b=1, c=-1, d=2, tx=0, ty=0)");
    });

    it("scale test case2", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 3);
        expect(matrix.toString()).toBe("(a=2, b=1.5, c=-1, d=3, tx=0, ty=0)");
    });

    it("scale test case3", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(3, 2);
        expect(matrix.toString()).toBe("(a=3, b=1, c=-1.5, d=2, tx=0, ty=0)");
    });

    it("scale test case4", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 10, 0);
        matrix.scale(-1, 2);
        expect(matrix.toString()).toBe("(a=-1, b=1, c=0.5, d=2, tx=-10, ty=0)");
    });

    it("scale test case5", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
        matrix.scale(3, -2);
        expect(matrix.toString()).toBe("(a=3, b=-1, c=-1.5, d=-2, tx=0, ty=-20)");
    });
});