import { Point } from "../Point";
import { describe, expect, it } from "vitest";

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