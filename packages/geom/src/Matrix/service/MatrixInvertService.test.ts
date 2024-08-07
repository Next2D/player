import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js invert test", () =>
{
    it("invert test case1", () =>
    {
        const matrix = new Matrix(2, 1, 1, 2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(0.6666666865348816);
        expect(matrix.b).toBe(-0.3333333432674408);
        expect(matrix.c).toBe(-0.3333333432674408);
        expect(matrix.d).toBe(0.6666666865348816);
        expect(matrix.tx).toBe(66.66667175292969);
        expect(matrix.ty).toBe(66.66667175292969);
    });

    it("invert test case2", () =>
    {
        const matrix = new Matrix(2, 1, 1, 2, -200, -200);
        matrix.invert();
        matrix.invert();

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(1);
        expect(matrix.c).toBe(1);
        expect(matrix.d).toBe(2);
        expect(matrix.tx).toBe(-200.00001525878906);
        expect(matrix.ty).toBe(-200.00001525878906);
    });

    it("invert test case3", () =>
    {
        const matrix = new Matrix(-2, 1, 1, 2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(-0.4000000059604645);
        expect(matrix.b).toBe(0.20000000298023224);
        expect(matrix.c).toBe(0.20000000298023224);
        expect(matrix.d).toBe(0.4000000059604645);
        expect(matrix.tx).toBe(-40);
        expect(matrix.ty).toBe(120);
    });

    it("invert test case4", () =>
    {
        const matrix = new Matrix(2, -1, 1, 2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(0.4000000059604645);
        expect(matrix.b).toBe(0.20000000298023224);
        expect(matrix.c).toBe(-0.20000000298023224);
        expect(matrix.d).toBe(0.4000000059604645);
        expect(matrix.tx).toBe(40);
        expect(matrix.ty).toBe(120);
    });

    it("invert test case5", () =>
    {
        const matrix = new Matrix(2, 1, -1, 2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(0.4000000059604645);
        expect(matrix.b).toBe(-0.20000000298023224);
        expect(matrix.c).toBe(0.20000000298023224);
        expect(matrix.d).toBe(0.4000000059604645);
        expect(matrix.tx).toBe(120);
        expect(matrix.ty).toBe(40);
    });

    it("invert test case6", () =>
    {
        const matrix = new Matrix(2, 1, 1, -2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(0.4000000059604645);
        expect(matrix.b).toBe(0.20000000298023224);
        expect(matrix.c).toBe(0.20000000298023224);
        expect(matrix.d).toBe(-0.4000000059604645);
        expect(matrix.tx).toBe(120);
        expect(matrix.ty).toBe(-40);
    });

    it("invert test case7", () =>
    {
        const matrix = new Matrix(-2, -1, -1, -2, -200, -200);
        matrix.invert();

        expect(matrix.a).toBe(-0.6666666865348816);
        expect(matrix.b).toBe(0.3333333432674408);
        expect(matrix.c).toBe(0.3333333432674408);
        expect(matrix.d).toBe(-0.6666666865348816);
        expect(matrix.tx).toBe(-66.66667175292969);
        expect(matrix.ty).toBe(-66.66667175292969);
    });
});