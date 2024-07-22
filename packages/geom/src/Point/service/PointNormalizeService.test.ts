import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js normalize test", () =>
{

    it("normalize test case1", () =>
    {
        const point = new Point(6, 8);
        point.normalize(2.5);
        expect(point.toString()).toBe("(x=1.5, y=2)");
    });

    it("normalize test case2", () =>
    {
        const point = new Point(6, 8);
        point.normalize(0);
        expect(point.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test case3", () =>
    {
        const point = new Point(6, 8);
        point.normalize(-2.5);
        expect(point.toString()).toBe("(x=-1.5, y=-2)");
    });

    it("normalize test case4", () =>
    {
        const point = new Point(-6, 8);
        point.normalize(2.5);
        expect(point.toString()).toBe("(x=-1.5, y=2)");
    });

    it("normalize test case5", () =>
    {
        const point = new Point(6, -8);
        point.normalize(2.5);
        expect(point.toString()).toBe("(x=1.5, y=-2)");
    });

    it("normalize test case6", () =>
    {
        const point = new Point(-6, -8);
        point.normalize(2.5);
        expect(point.toString()).toBe("(x=-1.5, y=-2)");
    });
});