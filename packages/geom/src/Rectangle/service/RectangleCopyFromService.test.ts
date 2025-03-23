import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js copyFrom test", () =>
{
    it("copyFrom test", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(15, 15, 5, 5);

        rectangle1.copyFrom(rectangle2);
        expect(rectangle1.x).toBe(15);
        expect(rectangle1.y).toBe(15);
        expect(rectangle1.width).toBe(5);
        expect(rectangle1.height).toBe(5);
        expect(rectangle2.x).toBe(15);
        expect(rectangle2.y).toBe(15);
        expect(rectangle2.width).toBe(5);
        expect(rectangle2.height).toBe(5);

        rectangle1.x = rectangle1.y = 10;
        rectangle1.width = rectangle1.height = 20;
        expect(rectangle1.x).toBe(10);
        expect(rectangle1.y).toBe(10);
        expect(rectangle1.width).toBe(20);
        expect(rectangle1.height).toBe(20);
        expect(rectangle2.x).toBe(15);
        expect(rectangle2.y).toBe(15);
        expect(rectangle2.width).toBe(5);
        expect(rectangle2.height).toBe(5);
    });
});