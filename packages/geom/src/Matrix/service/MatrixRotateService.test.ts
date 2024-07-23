import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js rotate test", () =>
{
    it("rotate test case1", () =>
    {
        const matrix = new Matrix(1, 0, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case2", () =>
    {
        const matrix = new Matrix(1, 0, 0, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case3", () =>
    {
        const matrix = new Matrix(-1, 0, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-0.7071067690849304, b=-0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case4", () =>
    {
        const matrix = new Matrix(-1, 0, 0, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-0.7071067690849304, b=-0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case5", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case6", () =>
    {
        const matrix = new Matrix(1, -10, 10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=7.77817440032959, b=-6.363961219787598, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case7", () =>
    {
        const matrix = new Matrix(1, 10, -10, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=-7.77817440032959, d=-6.363961219787598, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case8", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, -100, 110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-148.492431640625, ty=7.071067810058594)"
        );
    });

    it("rotate test case9", () =>
    {
        const matrix = new Matrix(1, 10, 10, 1, 100, -110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=148.492431640625, ty=-7.071067810058594)"
        );
    });

    it("rotate test case10", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=6.363961219787598, b=-7.77817440032959, c=-6.363961219787598, d=-7.77817440032959, tx=7.071067810058594, ty=-148.492431640625)"
        );
    });

    it("rotate test case11", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(0.5);
        expect(matrix.toString()).toBe(
            "(a=3.916672706604004, b=-9.255250930786133, c=-8.29640007019043, d=-5.67183780670166, tx=-35.021446228027344, ty=-144.4766387939453)"
        );
    });

    it("rotate test case12", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-0.5);
        expect(matrix.toString()).toBe(
            "(a=-5.67183780670166, b=-8.29640007019043, c=-9.255250930786133, d=3.916672706604004, tx=-140.4950714111328, ty=-48.591529846191406)"
        );
    });

    it("rotate test case13", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(90 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=10, b=-1, c=1, d=-10, tx=110, ty=-100)"
        );
    });

    it("rotate test case14", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(135 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=7.77817440032959, b=6.363961219787598, c=7.77817440032959, d=-6.363961219787598, tx=148.492431640625, ty=7.071067810058594)"
        );
    });

    it("rotate test case15", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(Math.PI);
        expect(matrix.toString()).toBe(
            "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
        );
    });

    it("rotate test case16", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-45 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-7.77817440032959, b=-6.363961219787598, c=-7.77817440032959, d=6.363961219787598, tx=-148.492431640625, ty=-7.071067810058594)"
        );
    });

    it("rotate test case17", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-90 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-10, b=1, c=-1, d=10, tx=-110, ty=100)"
        );
    });

    it("rotate test case18", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-135 / 180 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test case19", () =>
    {
        const matrix = new Matrix(-1, -10, -10, -1, -100, -110);
        matrix.rotate(-1 * Math.PI);
        expect(matrix.toString()).toBe(
            "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
        );
    });

});