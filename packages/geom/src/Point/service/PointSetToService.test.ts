import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Point.js setTo test", () =>
{

    it("setTo test case1", () =>
    {
        const point = new Point(10, 20);
        point.setTo(30, 40);
        expect(point.toString()).toBe("(x=30, y=40)");
    });

    it("setTo test case2", () =>
    {
        const p = new Point(10, 20);
        p.setTo(0, 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });

});