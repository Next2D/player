import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js isEmpty test", () =>
{
    it("isEmpty test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(-55, -55, 0, 0);
        expect(rectangle1.isEmpty()).toBe(false);
        expect(rectangle2.isEmpty()).toBe(true);
    });

    it("isEmpty test case2", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 0, 20);
        expect(rectangle1.isEmpty()).toBe(true);
    });

    it("isEmpty test case3", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 0);
        expect(rectangle1.isEmpty()).toBe(true);
    });
});