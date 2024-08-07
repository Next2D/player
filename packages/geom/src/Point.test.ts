import { Point } from "./Point";
import { describe, expect, it } from "vitest";

describe("Point.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect( new Point().namespace).toBe("next2d.geom.Point");
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
        expect(new Point().length).toBe(0);
    });

    it("default test case2", () =>
    {
        const point = new Point(10, 30);
        expect(point.length).toBe(31.622776601683793);
    });
});