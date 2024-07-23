import { Matrix } from "../../Matrix";
import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Matrix.js deltaTransformPoint test", () =>
{
    it("deltaTransformPoint test case1", () =>
    {
        const matrix = new Matrix(1, 0, 0, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-12.727921843528748, y=15.55634891986847)"
        );
    });

    it("deltaTransformPoint test case2", () =>
    {
        const matrix = new Matrix(10, 0, 0, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=2.384185791015625e-7, y=28.284271001815796)"
        );
    });

    it("deltaTransformPoint test case3", () =>
    {
        const matrix = new Matrix(1, 10, 0, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.x | 0).toBe(-26);
        expect(point2.y | 0).toBe(29);
    });

    it("deltaTransformPoint test case4", () =>
    {
        const matrix = new Matrix(1, 0, 10, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=128.6934379339218, y=156.97770154476166)"
        );
    });

    it("deltaTransformPoint test case5", () =>
    {
        const matrix = new Matrix(1, 0, 0, 10, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-140.007142663002, y=142.83556973934174)"
        );
    });

    it("deltaTransformPoint test case6", () =>
    {
        const matrix = new Matrix(-1, 0, 0, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-15.55634891986847, y=12.727921843528748)"
        );
    });

    it("deltaTransformPoint test case7", () =>
    {
        const matrix = new Matrix(1, 0, 0, -1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=15.55634891986847, y=-12.727921843528748)"
        );
    });

    it("deltaTransformPoint test case8", () =>
    {
        const matrix = new Matrix(-1, 0, 0, -1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=12.727921843528748, y=-15.55634891986847)"
        );
    });

    it("deltaTransformPoint test case9", () =>
    {
        const matrix = new Matrix(-1, -1, 0, -1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=14.142135381698608, y=-16.97056245803833)"
        );
    });

    it("deltaTransformPoint test case10", () =>
    {
        const matrix = new Matrix(-1, 0, -1, -1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.x | 0).toBe(-1);
        expect(point2.y | 0).toBe(-29);
    });

    it("deltaTransformPoint test case11", () =>
    {
        const matrix = new Matrix(-1, -1, -1, -1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.x | 0).toBe(0);
        expect(point2.y | 0).toBe(-31);
    });

    it("deltaTransformPoint test case12", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(90 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-22, y=22)"
        );
    });

    it("deltaTransformPoint test case13", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(135 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-31.11269783973694, y=2.4424906541753444e-15)"
        );
    });

    it("deltaTransformPoint test case14", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(180 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-22, y=-22)"
        );
    });

    it("deltaTransformPoint test case15", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(-45 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.x | 0).toBe(31);
        expect(point2.y | 0).toBe(0);
    });

    it("deltaTransformPoint test case16", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(-90 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=22, y=-22)"
        );
    });

    it("deltaTransformPoint test case17", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(-135 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.x | 0).toBe(0);
        expect(point2.y | 0).toBe(-31);

    });

    it("deltaTransformPoint test case18", () =>
    {
        const matrix = new Matrix(1, 1, 1, 1, 100, 110);
        matrix.translate(10, 0);
        matrix.rotate(-180 / 180 * Math.PI);

        const point1 = new Point(2, 20);
        const point2 = matrix.deltaTransformPoint(point1);

        expect(point2.toString()).toBe(
            "(x=-22, y=-22)"
        );
    });
});