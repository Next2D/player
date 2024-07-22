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

        expect(rectangle1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(rectangle2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});