import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js containsRect test", () =>
{
    it("containsRect test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(15, 15, 5, 5);
        expect(rectangle1.containsRect(rectangle2)).toBe(true);

        const rectangle3 = new Rectangle(10, 10, 20, 20);
        const rectangle4 = new Rectangle(10, 10, 20, 20);
        expect(rectangle3.containsRect(rectangle4)).toBe(true);

        const rectangle5 = new Rectangle(10, 10, 20, 20);
        const rectangle6 = new Rectangle(9, 9, 20, 20);
        expect(rectangle5.containsRect(rectangle6)).toBe(false);

        const rectangle7 = new Rectangle(10, 10, 20, 20);
        const rectangle8 = new Rectangle(15, 15, 20, 20);
        expect(rectangle7.containsRect(rectangle8)).toBe(false);
    });

    it("containsRect test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const rectangle2 = new Rectangle(-15, -15, -5, -5);
        expect(rectangle1.containsRect(rectangle2)).toBe(false);

        const rectangle3 = new Rectangle(-10, -10, 20, 20);
        const rectangle4 = new Rectangle(-15, -15, 5, 5);
        expect(rectangle3.containsRect(rectangle4)).toBe(false);
    });
});