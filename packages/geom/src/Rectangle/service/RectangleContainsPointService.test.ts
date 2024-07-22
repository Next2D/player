import { Rectangle } from "../../Rectangle";
import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Rectangle.js containsPoint test", () =>
{
    it("containsPoint test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);

        const p1 = new Point(30, 50);
        expect(rectangle.containsPoint(p1)).toBe(true);

        const p2 = new Point(110, 150);
        expect(rectangle.containsPoint(p2)).toBe(false);

        const p3 = new Point(109, 149);
        expect(rectangle.containsPoint(p3)).toBe(true);

        const p4 = new Point(20, 40);
        expect(rectangle.containsPoint(p4)).toBe(false);
    });

    it("containsPoint test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);

        const p1 = new Point(-30, -50);
        expect(rectangle.containsPoint(p1)).toBe(false);

        const p2 = new Point(-110, -150);
        expect(rectangle.containsPoint(p2)).toBe(false);

        const p3 = new Point(-109, -149);
        expect(rectangle.containsPoint(p3)).toBe(false);

        const p5 = new Point(110, 150);
        expect(rectangle.containsPoint(p5)).toBe(false);

        const p6 = new Point(109, 149);
        expect(rectangle.containsPoint(p6)).toBe(false);

        const p4 = new Point(-20, -40);
        expect(rectangle.containsPoint(p4)).toBe(false);
    });
});