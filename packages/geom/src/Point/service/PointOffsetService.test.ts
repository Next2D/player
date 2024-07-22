import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js offset test", () =>
{

    it("offset test case1", () =>
    {
        const point = new Point(10, 20);
        point.offset(30, 40);
        expect(point.toString()).toBe("(x=40, y=60)");
    });

    it("offset test case2", () =>
    {
        const point = new Point(10, 20);
        point.offset(-30, 40);
        expect(point.toString()).toBe("(x=-20, y=60)");
    });

    it("offset test case3", () =>
    {
        const point = new Point(10, 20);
        point.offset(30, -40);
        expect(point.toString()).toBe("(x=40, y=-20)");
    });

    it("offset test case4", () =>
    {
        const point = new Point(-10, 20);
        point.offset(30, 40);
        expect(point.toString()).toBe("(x=20, y=60)");
    });

    it("offset test case5", () =>
    {
        const point = new Point(10, -20);
        point.offset(30, 40);
        expect(point.toString()).toBe("(x=40, y=20)");
    });

});