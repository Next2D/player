import { Matrix } from "../../Matrix";
import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Matrix.js transformPoint test", () =>
{
    it("transformPoint test case1", () =>
    {
        const matrix = new Matrix(1, 0, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-19.79898965358734, y=164.04878056049347)"
        );
    });

    it("transformPoint test case2", () =>
    {
        const matrix = new Matrix(1, 1, 0, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-21.213203191757202, y=165.46299409866333)"
        );
    });

    it("transformPoint test case3", () =>
    {
        const matrix = new Matrix(1, 0, 1, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.x | 0).toBe(-5);
        expect(point2.y | 0).toBe(178);

    });

    it("transformPoint test case4", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.x | 0).toBe(-7);
        expect(point2.y | 0).toBe(179);
    });

    it("transformPoint test case5", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.x | 0).toBe(-7);
        expect(point2.y | 0).toBe(117);
    });

    it("transformPoint test case6", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.x | 0).toBe(-7);
        expect(point2.y | 0).toBe(117);
    });

    it("transformPoint test case7", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(90 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-88, y=78)"
        );
    });

    it("transformPoint test case8", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(135 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-117.37973380088806, y=-7.071067810058596)"
        );
    });

    it("transformPoint test case9", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(180 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-78, y=-88)"
        );
    });

    it("transformPoint test case10", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(-45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.x | 0).toBe(117);
        expect(point2.y | 0).toBe(7);

    });

    it("transformPoint test case11", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(-90 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=88, y=-78)"
        );
    });

    it("transformPoint test case12", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(-135 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=7.071067810058591, y=-117.37973380088806)"
        );
    });

    it("transformPoint test case13", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.rotate(-180 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.transformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-78, y=-88)"
        );
    });
});