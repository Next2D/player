import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js invert test", () =>
{
    it("invert test case1", () =>
    {
        const matrix = new Matrix(2, 1, 1, 2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=0.6666666865348816, b=-0.3333333432674408, c=-0.3333333432674408, d=0.6666666865348816, tx=66.66667175292969, ty=66.66667175292969)"
        );
    });

    it("invert test case2", () =>
    {
        const matrix = new Matrix(2, 1, 1, 2, -200, -200);
        matrix.invert();
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=2, b=1, c=1, d=2, tx=-200.00001525878906, ty=-200.00001525878906)"
        );
    });

    it("invert test case3", () =>
    {
        const matrix = new Matrix(-2, 1, 1, 2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=-0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=-40, ty=120)"
        );
    });

    it("invert test case4", () =>
    {
        const matrix = new Matrix(2, -1, 1, 2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=0.4000000059604645, b=0.20000000298023224, c=-0.20000000298023224, d=0.4000000059604645, tx=40, ty=120)"
        );
    });

    it("invert test case5", () =>
    {
        const matrix = new Matrix(2, 1, -1, 2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=0.4000000059604645, b=-0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=120, ty=40)"
        );
    });

    it("invert test case6", () =>
    {
        const matrix = new Matrix(2, 1, 1, -2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=-0.4000000059604645, tx=120, ty=-40)"
        );
    });

    it("invert test case7", () =>
    {
        const matrix = new Matrix(-2, -1, -1, -2, -200, -200);
        matrix.invert();
        expect(matrix.toString()).toBe(
            "(a=-0.6666666865348816, b=0.3333333432674408, c=0.3333333432674408, d=-0.6666666865348816, tx=-66.66667175292969, ty=-66.66667175292969)"
        );
    });
});