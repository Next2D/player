import { Rectangle } from "../../Rectangle";
import { Point } from "../../Point";
import { describe, expect, it } from "vitest";

describe("Rectangle.js inflatePoint test", () =>
{
    it("inflatePoint test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const point1 = new Point(10, 10);
        rectangle1.inflatePoint(point1);
        expect(rectangle1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        const point2 = new Point(20, 20);
        rectangle2.inflatePoint(point2);
        expect(rectangle2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflatePoint test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const point1 = new Point(10, 10);
        rectangle1.inflatePoint(point1);
        expect(rectangle1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        const rectangle2 = new Rectangle(-10, -10, 20, 20);
        const point2 = new Point(20, 20);
        rectangle2.inflatePoint(point2);
        expect(rectangle2.toString()).toBe("(x=-30, y=-30, w=60, h=60)");
    });

});