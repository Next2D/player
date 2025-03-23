import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js setEmpty test", () =>
{
    it("setEmpty test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(-55, -55, 0, 0);

        rectangle1.setEmpty();
        rectangle2.setEmpty();

        expect(rectangle1.x).toBe(0);
        expect(rectangle1.y).toBe(0);
        expect(rectangle1.width).toBe(0);
        expect(rectangle1.height).toBe(0);

        expect(rectangle2.x).toBe(0);
        expect(rectangle2.y).toBe(0);
        expect(rectangle2.width).toBe(0);
        expect(rectangle2.height).toBe(0);
    });
});