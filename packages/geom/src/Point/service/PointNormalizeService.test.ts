import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js normalize test", () =>
{

    it("normalize test case1", () =>
    {
        const point = new Point(6, 8);
        point.normalize(2.5);

        expect(point.x).toBe(1.5);
        expect(point.y).toBe(2);
    });

    it("normalize test case2", () =>
    {
        const point = new Point(6, 8);
        point.normalize(0);

        expect(point.x).toBe(0);
        expect(point.y).toBe(0);
    });

    it("normalize test case3", () =>
    {
        const point = new Point(6, 8);
        point.normalize(-2.5);

        expect(point.x).toBe(-1.5);
        expect(point.y).toBe(-2);
    });

    it("normalize test case4", () =>
    {
        const point = new Point(-6, 8);
        point.normalize(2.5);

        expect(point.x).toBe(-1.5);
        expect(point.y).toBe(2);
    });

    it("normalize test case5", () =>
    {
        const point = new Point(6, -8);
        point.normalize(2.5);

        expect(point.x).toBe(1.5);
        expect(point.y).toBe(-2);
    });

    it("normalize test case6", () =>
    {
        const point = new Point(-6, -8);
        point.normalize(2.5);

        expect(point.x).toBe(-1.5);
        expect(point.y).toBe(-2);
    });
});