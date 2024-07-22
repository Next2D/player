import { Point } from "../Point";
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