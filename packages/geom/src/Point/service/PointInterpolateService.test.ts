import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js interpolate test", () =>
{

    it("interpolate test case1", () =>
    {
        const p1 = new Point(0, 0);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=3, y=4)");
    });

    it("interpolate test2 case", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=9)");
    });

    it("interpolate test case3", () =>
    {
        const p1 = new Point(-9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=9)");
    });

    it("interpolate test case4", () =>
    {
        const p1 = new Point(9, -10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-1)");
    });

    it("interpolate test case5", () =>
    {
        const p1 = new Point(-9, -10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=-1)");
    });

    it("interpolate test case6", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(-6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=9)");
    });

    it("interpolate test case7", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=1)");
    });

    it("interpolate test case8", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(-6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=1)");
    });

    it("interpolate test case9", () =>
    {
        const p1 = new Point(-9, 10);
        const p2 = new Point(-6, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=9)");
    });

    it("interpolate test case10", () =>
    {
        const p1 = new Point(9, -10);
        const p2 = new Point(6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-9)");
    });

    it("interpolate test case11", () =>
    {
        const p1 = new Point(-9, -10);
        const p2 = new Point(-6, -8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=-9)");
    });

    it("interpolate test case12", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -0.5);
        expect(p3.toString()).toBe("(x=4.5, y=7)");
    });

    it("interpolate test case13", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(9, 8);
        const p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=9, y=9)");
    });

    it("interpolate test case14", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1);
        expect(p3.toString()).toBe("(x=9, y=10)");
    });

    it("interpolate test case15", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0);
        expect(p3.toString()).toBe("(x=6, y=8)");
    });

    it("interpolate test case16", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1.5);
        expect(p3.toString()).toBe("(x=10.5, y=11)");
    });

    it("interpolate test case17", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 0.2);
        expect(p3.toString()).toBe("(x=6.6, y=8.4)");
    });

    it("interpolate test case18", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -0.2);
        expect(p3.toString()).toBe("(x=5.4, y=7.6)");
    });

    it("interpolate test case19", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, 1.2);
        expect(p3.toString()).toBe("(x=9.6, y=10.4)");
    });

    it("interpolate test case20", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -1.2);
        expect(p3.toString()).toBe("(x=2.3999999999999995, y=5.6)");
    });

    it("interpolate test case21", () =>
    {
        const p1 = new Point(9, 10);
        const p2 = new Point(6, 8);
        const p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=3, y=6)");
    });

    it("interpolate test case22", () =>
    {
        const p1 = new Point(6, 8);
        const p2 = new Point(9, 10);
        const p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=12, y=12)");
    });

});