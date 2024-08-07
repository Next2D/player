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

        expect(rectangle1.x).toBe(0);
        expect(rectangle1.y).toBe(0);
        expect(rectangle1.width).toBe(40);
        expect(rectangle1.height).toBe(40);

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        const point2 = new Point(20, 20);
        rectangle2.inflatePoint(point2);
        
        expect(rectangle2.x).toBe(-10);
        expect(rectangle2.y).toBe(-10);
        expect(rectangle2.width).toBe(60);
        expect(rectangle2.height).toBe(60);
    });

    it("inflatePoint test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const point1 = new Point(10, 10);
        rectangle1.inflatePoint(point1);

        expect(rectangle1.x).toBe(-20);
        expect(rectangle1.y).toBe(-20);
        expect(rectangle1.width).toBe(0);
        expect(rectangle1.height).toBe(0);

        const rectangle2 = new Rectangle(-10, -10, 20, 20);
        const point2 = new Point(20, 20);
        rectangle2.inflatePoint(point2);
        expect(rectangle2.x).toBe(-30);
        expect(rectangle2.y).toBe(-30);
        expect(rectangle2.width).toBe(60);
        expect(rectangle2.height).toBe(60);
    });

});