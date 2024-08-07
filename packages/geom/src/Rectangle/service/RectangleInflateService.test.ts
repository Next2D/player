import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js inflate test", () =>
{
    it("inflate test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        rectangle1.inflate(10, 10);

        expect(rectangle1.x).toBe(0);
        expect(rectangle1.y).toBe(0);
        expect(rectangle1.width).toBe(40);
        expect(rectangle1.height).toBe(40);

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        rectangle2.inflate(20, 20);
        expect(rectangle2.x).toBe(-10);
        expect(rectangle2.y).toBe(-10);
        expect(rectangle2.width).toBe(60);
        expect(rectangle2.height).toBe(60);
    });

    it("inflate test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        rectangle1.inflate(10, 10);
        expect(rectangle1.x).toBe(-20);
        expect(rectangle1.y).toBe(-20);
        expect(rectangle1.width).toBe(0);
        expect(rectangle1.height).toBe(0);

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        rectangle2.inflate(-20, -20);
        expect(rectangle2.x).toBe(30);
        expect(rectangle2.y).toBe(30);
        expect(rectangle2.width).toBe(-20);
        expect(rectangle2.height).toBe(-20);
    });
});