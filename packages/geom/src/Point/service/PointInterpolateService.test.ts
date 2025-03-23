import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js interpolate test", () =>
{

    it("interpolate test case1", () =>
    {
        const p1 = new Point(0, 0);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(3);
        expect(p3.y).toBe(4);
    });

    it("interpolate test2 case", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(7.5);
        expect(p3.y).toBe(9);
    });

    it("interpolate test case3", () =>
    {
        const p1 = new Point(-9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(-1.5);
        expect(p3.y).toBe(9);
    });

    it("interpolate test case4", () =>
    {
        const p1 = new Point(9, -10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(7.5);
        expect(p3.y).toBe(-1);
    });

    it("interpolate test case5", () =>
    {
        const p1 = new Point(-9, -10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(-1.5);
        expect(p3.y).toBe(-1);
    });

    it("interpolate test case6", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(-6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(1.5);
        expect(p3.y).toBe(9);
    });

    it("interpolate test case7", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(7.5);
        expect(p3.y).toBe(1);
    });

    it("interpolate test case8", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(-6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(1.5);
        expect(p3.y).toBe(1);
    });

    it("interpolate test case9", () =>
    {
        const p1 = new Point(-9, 10);
        const p2 = new Point(-6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(-7.5);
        expect(p3.y).toBe(9);
    });

    it("interpolate test case10", () =>
    {
        const p1 = new Point(9, -10);
        const p2 = new Point(6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(7.5);
        expect(p3.y).toBe(-9);
    });

    it("interpolate test case11", () =>
    {
        const p1 = new Point(-9, -10);
        const p2 = new Point(-6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(-7.5);
        expect(p3.y).toBe(-9);
    });

    it("interpolate test case12", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -0.5);

        expect(p3.x).toBe(4.5);
        expect(p3.y).toBe(7);
    });

    it("interpolate test case13", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(9, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);

        expect(p3.x).toBe(9);
        expect(p3.y).toBe(9);
    });

    it("interpolate test case14", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1);

        expect(p3.x).toBe(9);
        expect(p3.y).toBe(10);
    });

    it("interpolate test case15", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0);

        expect(p3.x).toBe(6);
        expect(p3.y).toBe(8);
    });

    it("interpolate test case16", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1.5);

        expect(p3.x).toBe(10.5);
        expect(p3.y).toBe(11);
    });

    it("interpolate test case17", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.2);

        expect(p3.x).toBe(6.6);
        expect(p3.y).toBe(8.4);
    });

    it("interpolate test case18", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -0.2);

        expect(p3.x).toBe(5.4);
        expect(p3.y).toBe(7.6);
    });

    it("interpolate test case19", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1.2);

        expect(p3.x).toBe(9.6);
        expect(p3.y).toBe(10.4);
    });

    it("interpolate test case20", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -1.2);

        expect(p3.x).toBe(2.3999999999999995);
        expect(p3.y).toBe(5.6);
    });

    it("interpolate test case21", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -1);

        expect(p3.x).toBe(3);
        expect(p3.y).toBe(6);
    });

    it("interpolate test case22", () =>
    {
        const p1 = new Point(6, 8);
        const p2 = new Point(9, 10);
        const p3 = Point.interpolate(p1, p2, -1);

        expect(p3.x).toBe(12);
        expect(p3.y).toBe(12);
    });

});