import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js clone test", () =>
{
    it("clone test", () =>
    {
        const rectangle1 = new Rectangle(30, 50, 80, 100);
        const rectangle2 = rectangle1.clone();
        rectangle2.x = 100;

        expect(rectangle1.toString()).toBe("(x=30, y=50, w=80, h=100)");
        expect(rectangle2.toString()).toBe("(x=100, y=50, w=80, h=100)");
    });
});