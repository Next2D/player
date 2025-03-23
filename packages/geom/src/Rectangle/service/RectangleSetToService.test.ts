import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js setTo test", () =>
{
    it("setTo test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(-55, -55, 0, 0);

        rectangle1.setTo(5, 5, 5, 5);
        rectangle2.setTo(10, 10, 10, 10);

        expect(rectangle1.x).toBe(5);
        expect(rectangle1.y).toBe(5);
        expect(rectangle1.width).toBe(5);
        expect(rectangle1.height).toBe(5);

        expect(rectangle2.x).toBe(10);
        expect(rectangle2.y).toBe(10);
        expect(rectangle2.width).toBe(10);
        expect(rectangle2.height).toBe(10);
    });
});