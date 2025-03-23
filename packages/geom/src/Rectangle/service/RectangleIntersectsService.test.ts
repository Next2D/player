import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js intersects test", () =>
{
    it("intersects test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(5, 5, 5, 5);
        expect(rectangle1.intersects(rectangle2)).toBe(false);

        const rectangle3 = new Rectangle(10, 10, 20, 20);
        const rectangle4 = new Rectangle(5, 5, 25, 25);
        expect(rectangle3.intersects(rectangle4)).toBe(true);
    });

    it("intersects test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const rectangle2 = new Rectangle(-5, -5, -25, -25);
        expect(rectangle1.intersects(rectangle2)).toBe(false);

        const rectangle3 = new Rectangle(-10, -10, 20, 20);
        const rectangle4 = new Rectangle(-5, -5, 25, 25);
        expect(rectangle3.intersects(rectangle4)).toBe(true);
    });

    it("intersects test case3", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(5, 40, 10, 10);
        expect(rectangle1.intersects(rectangle2)).toBe(false);

        const rectangle3 = new Rectangle(10, 10, 20, 20);
        const rectangle4 = new Rectangle(5, 15, 10, 10);
        expect(rectangle3.intersects(rectangle4)).toBe(true);
    });
});