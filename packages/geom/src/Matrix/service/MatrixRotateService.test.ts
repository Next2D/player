import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js rotate test", () =>
{
    it("rotate test case1", () =>
    {
        const matrix = new Matrix(1, 0, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(0.7071067690849304);
        expect(matrix.b).toBeCloseTo(0.7071067690849304);
        expect(matrix.c).toBeCloseTo(-0.7071067690849304);
        expect(matrix.d).toBeCloseTo(0.7071067690849304);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case2", () =>
    {
        const matrix = new Matrix(1, 0, 0, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(0.7071067690849304);
        expect(matrix.b).toBeCloseTo(0.7071067690849304);
        expect(matrix.c).toBeCloseTo(0.7071067690849304);
        expect(matrix.d).toBeCloseTo(-0.7071067690849304);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case3", () =>
    {
        const matrix = new Matrix(-1, 0, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-0.7071067690849304);
        expect(matrix.b).toBeCloseTo(-0.7071067690849304);
        expect(matrix.c).toBeCloseTo(-0.7071067690849304);
        expect(matrix.d).toBeCloseTo(0.7071067690849304);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case4", () =>
    {
        const matrix = new Matrix(-1, 0, 0, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-0.7071067690849304);
        expect(matrix.b).toBeCloseTo(-0.7071067690849304);
        expect(matrix.c).toBeCloseTo(0.7071067690849304);
        expect(matrix.d).toBeCloseTo(-0.7071067690849304);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case5", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-6.363961219787598);
        expect(matrix.b).toBeCloseTo(7.77817440032959);
        expect(matrix.c).toBeCloseTo(6.363961219787598);
        expect(matrix.d).toBeCloseTo(7.77817440032959);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case6", () =>
    {
        const matrix = new Matrix(1, -10, 10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(7.77817440032959);
        expect(matrix.b).toBeCloseTo(-6.363961219787598);
        expect(matrix.c).toBeCloseTo(6.363961219787598);
        expect(matrix.d).toBeCloseTo(7.77817440032959);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case7", () =>
    {
        const matrix = new Matrix(1, 10, -10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.a).toBeCloseTo(-6.363961219787598);
        expect(matrix.b).toBeCloseTo(7.77817440032959);
        expect(matrix.c).toBeCloseTo(-7.77817440032959);
        expect(matrix.d).toBeCloseTo(-6.363961219787598);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case8", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, -100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.a).toBeCloseTo(-6.363961219787598);
        expect(matrix.b).toBeCloseTo(7.77817440032959);
        expect(matrix.c).toBeCloseTo(6.363961219787598);
        expect(matrix.d).toBeCloseTo(7.77817440032959);
        expect(matrix.tx).toBeCloseTo(-148.492431640625);
        expect(matrix.ty).toBeCloseTo(7.071067810058594);
    });

    it("rotate test case9", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, 100, -110);
        matrix.rotate(45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-6.363961219787598);
        expect(matrix.b).toBeCloseTo(7.77817440032959);
        expect(matrix.c).toBeCloseTo(6.363961219787598);
        expect(matrix.d).toBeCloseTo(7.77817440032959);
        expect(matrix.tx).toBeCloseTo(148.492431640625);
        expect(matrix.ty).toBeCloseTo(-7.071067810058594);
    });

    it("rotate test case10", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.a).toBeCloseTo(6.363961219787598);
        expect(matrix.b).toBeCloseTo(-7.77817440032959);
        expect(matrix.c).toBeCloseTo(-6.363961219787598);
        expect(matrix.d).toBeCloseTo(-7.77817440032959);
        expect(matrix.tx).toBeCloseTo(7.071067810058594);
        expect(matrix.ty).toBeCloseTo(-148.492431640625);
    });

    it("rotate test case11", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(0.5);

        expect(matrix.a).toBeCloseTo(3.916672706604004);
        expect(matrix.b).toBeCloseTo(-9.255250930786133);
        expect(matrix.c).toBeCloseTo(-8.29640007019043);
        expect(matrix.d).toBeCloseTo(-5.67183780670166);
        expect(matrix.tx).toBeCloseTo(-35.021446228027344);
        expect(matrix.ty).toBeCloseTo(-144.4766387939453);
    });

    it("rotate test case12", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-0.5);

        expect(matrix.a).toBeCloseTo(-5.67183780670166);
        expect(matrix.b).toBeCloseTo(-8.29640007019043);
        expect(matrix.c).toBeCloseTo(-9.255250930786133);
        expect(matrix.d).toBeCloseTo(3.916672706604004);
        expect(matrix.tx).toBeCloseTo(-140.4950714111328);
        expect(matrix.ty).toBeCloseTo(-48.591529846191406);
    });

    it("rotate test case13", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(90 / 180 * Math.PI);
        expect(matrix.a).toBeCloseTo(10);
        expect(matrix.b).toBeCloseTo(-1);
        expect(matrix.c).toBeCloseTo(1);
        expect(matrix.d).toBeCloseTo(-10);
        expect(matrix.tx).toBeCloseTo(110);
        expect(matrix.ty).toBeCloseTo(-100);
    });

    it("rotate test case14", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(135 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(7.77817440032959);
        expect(matrix.b).toBeCloseTo(6.363961219787598);
        expect(matrix.c).toBeCloseTo(7.77817440032959);
        expect(matrix.d).toBeCloseTo(-6.363961219787598);
        expect(matrix.tx).toBeCloseTo(148.492431640625);
        expect(matrix.ty).toBeCloseTo(7.071067810058594);
    });

    it("rotate test case15", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(Math.PI);

        expect(matrix.a).toBeCloseTo(1);
        expect(matrix.b).toBeCloseTo(10);
        expect(matrix.c).toBeCloseTo(10);
        expect(matrix.d).toBeCloseTo(1);
        expect(matrix.tx).toBeCloseTo(100);
        expect(matrix.ty).toBeCloseTo(110);
    });

    it("rotate test case16", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-45 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-7.77817440032959);
        expect(matrix.b).toBeCloseTo(-6.363961219787598);
        expect(matrix.c).toBeCloseTo(-7.77817440032959);
        expect(matrix.d).toBeCloseTo(6.363961219787598);
        expect(matrix.tx).toBeCloseTo(-148.492431640625);
        expect(matrix.ty).toBeCloseTo(-7.071067810058594);
    });

    it("rotate test case17", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-90 / 180 * Math.PI);

        expect(matrix.a).toBeCloseTo(-10);
        expect(matrix.b).toBeCloseTo(1);
        expect(matrix.c).toBeCloseTo(-1);
        expect(matrix.d).toBeCloseTo(10);
        expect(matrix.tx).toBeCloseTo(-110);
        expect(matrix.ty).toBeCloseTo(100);
    });

    it("rotate test case18", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-135 / 180 * Math.PI);
        expect(matrix.a).toBeCloseTo(-6.363961219787598);
        expect(matrix.b).toBeCloseTo(7.77817440032959);
        expect(matrix.c).toBeCloseTo(6.363961219787598);
        expect(matrix.d).toBeCloseTo(7.77817440032959);
        expect(matrix.tx).toBeCloseTo(-7.071067810058594);
        expect(matrix.ty).toBeCloseTo(148.492431640625);
    });

    it("rotate test case19", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-1 * Math.PI);
        expect(matrix.a).toBeCloseTo(1);
        expect(matrix.b).toBeCloseTo(10);
        expect(matrix.c).toBeCloseTo(10);
        expect(matrix.d).toBeCloseTo(1);
        expect(matrix.tx).toBeCloseTo(100);
        expect(matrix.ty).toBeCloseTo(110);
    });

});