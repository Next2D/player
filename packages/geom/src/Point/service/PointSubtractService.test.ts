import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js subtract test", () =>
{

    it("subtract test case1", () =>
    {
        const p1 = new Point(6, 8);
        const p2 = new Point(1.5, 2);
        const p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=4.5, y=6)");
    });

    it("subtract test case2", () =>
    {
        const p1 = new Point(6, 8);
        const p2 = new Point(-1, 2);
        const p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=7, y=6)");
    });

});