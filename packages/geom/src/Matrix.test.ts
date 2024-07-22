import { Matrix } from "./Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const matrix = new Matrix();
        expect(matrix.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
    });

    it("toString test2 success", () =>
    {
        const matrix = new Matrix(2, 3, 4, 5, 6, 7);
        expect(matrix.toString()).toBe("(a=2, b=3, c=4, d=5, tx=6, ty=7)");
    });
});

describe("Matrix.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Matrix.toString()).toBe("[class Matrix]");
    });

});

describe("Matrix.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const matrix = new Matrix();
        expect(matrix.namespace).toBe("next2d.geom.Matrix");
    });

    it("namespace test static", () =>
    {
        expect(Matrix.namespace).toBe("next2d.geom.Matrix");
    });
});