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

        expect(rectangle1.toString()).toBe("(x=5, y=5, w=5, h=5)");
        expect(rectangle2.toString()).toBe("(x=10, y=10, w=10, h=10)");
    });
});