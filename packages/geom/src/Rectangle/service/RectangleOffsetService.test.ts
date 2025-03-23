import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js offset test", () =>
{
    it("offset test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(-55, -55, 0, 0);

        rectangle1.offset(5, 8);
        rectangle2.offset(60, 30);

        expect(rectangle1.x).toBe(15);
        expect(rectangle1.y).toBe(18);
        expect(rectangle1.width).toBe(20);
        expect(rectangle1.height).toBe(20);

        expect(rectangle2.x).toBe(5);
        expect(rectangle2.y).toBe(-25);
        expect(rectangle2.width).toBe(0);
        expect(rectangle2.height).toBe(0);
    });
});