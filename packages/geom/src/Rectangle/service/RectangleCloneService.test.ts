import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js clone test", () =>
{
    it("clone test", () =>
    {
        const rectangle1 = new Rectangle(30, 50, 80, 100);
        const rectangle2 = rectangle1.clone();
        rectangle2.x = 100;

        expect(rectangle1.x).toBe(30);
        expect(rectangle2.x).toBe(100);
        expect(rectangle1.y).toBe(50);
        expect(rectangle2.y).toBe(50);
        expect(rectangle1.width).toBe(80);
        expect(rectangle2.width).toBe(80);
        expect(rectangle1.height).toBe(100);
        expect(rectangle2.height).toBe(100);
    });
});