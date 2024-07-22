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

        expect(rectangle1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(rectangle2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });
});