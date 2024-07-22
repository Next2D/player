import { Point } from "./Point";
import { describe, expect, it } from "vitest";

describe("Point.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const point = new Point();
        expect(point.toString()).toBe("(x=0, y=0)");
    });

    it("toString test2 success", () =>
    {
        const point = new Point(1, 2);
        expect(point.toString()).toBe("(x=1, y=2)");
    });
});

describe("Point.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Point.toString()).toBe("[class Point]");
    });

});

describe("Point.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const point = new Point();
        expect(point.namespace).toBe("next2d.geom.Point");
    });

    it("namespace test static", () =>
    {
        expect(Point.namespace).toBe("next2d.geom.Point");
    });
});

describe("Point.js length test", () =>
{
    it("default test case1", () =>
    {
        const point = new Point();
        expect(point.length).toBe(0);
    });

    it("default test case2", () =>
    {
        const point = new Point(10, 30);
        expect(point.length).toBe(31.622776601683793);
    });
});