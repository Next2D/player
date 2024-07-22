import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js copyFrom test", () =>
{
    it("copyFrom test", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(15, 15, 5, 5);

        rectangle1.copyFrom(rectangle2);
        expect(rectangle1.toString()).toBe("(x=15, y=15, w=5, h=5)");
        expect(rectangle2.toString()).toBe("(x=15, y=15, w=5, h=5)");

        rectangle1.x = rectangle1.y = 10;
        rectangle1.width = rectangle1.height = 20;
        expect(rectangle1.toString()).toBe("(x=10, y=10, w=20, h=20)");
        expect(rectangle2.toString()).toBe("(x=15, y=15, w=5, h=5)");
    });
});