import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js distance test", () =>
{
    it("distance test case1", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(20, 20);
        expect(Point.distance(p1, p2)).toBe(14.142135623730951);
    });

    it("distance test case2", () =>
    {
        const p1 = new Point(-10, 10);
        const p2 = new Point(20, 20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case3", () =>
    {
        const p1 = new Point(10, -10);
        const p2 = new Point(20, 20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case4", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(-20, 20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case5", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(20, -20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case6", () =>
    {
        const p1 = new Point(10, -10);
        const p2 = new Point(20, -20);
        expect(Point.distance(p1, p2)).toBe(14.142135623730951);
    });

    it("distance test case7", () =>
    {
        const p1 = new Point(-10, 10);
        const p2 = new Point(-20, 20);
        expect(Point.distance(p1, p2)).toBe(14.142135623730951);
    });

    it("distance test case8", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(20, 20);
        expect(Point.distance(p1, p2)).toBe(42.42640687119285);
    });

    it("distance test case9", () =>
    {
        const p1 = new Point(10, 10);
        const p2 = new Point(-20, -20);
        expect(Point.distance(p1, p2)).toBe(42.42640687119285);
    });

    it("distance test case10", () =>
    {
        const p1 = new Point(-10, 10);
        const p2 = new Point(20, -20);
        expect(Point.distance(p1, p2)).toBe(42.42640687119285);
    });

    it("distance test case11", () =>
    {
        const p1 = new Point(10, -10);
        const p2 = new Point(-20, 20);
        expect(Point.distance(p1, p2)).toBe(42.42640687119285);
    });

    it("distance test case12", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(-20, 20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case13", () =>
    {
        const p1 = new Point(10, -10);
        const p2 = new Point(-20, -20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case14", () =>
    {
        const p1 = new Point(-10, 10);
        const p2 = new Point(-20, -20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case15", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(20, -20);
        expect(Point.distance(p1, p2)).toBe(31.622776601683793);
    });

    it("distance test case16", () =>
    {
        const p1 = new Point(-10, -10);
        const p2 = new Point(-20, -20);
        expect(Point.distance(p1, p2)).toBe(14.142135623730951);
    });
});