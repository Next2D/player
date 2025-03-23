import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js equals test", () =>
{
    it("equals test", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(10, 10, 20, 20);
        expect(rectangle1.equals(rectangle2)).toBe(true);

        const rectangle3 = new Rectangle(10, 10, 20, 20);
        const rectangle4 = new Rectangle(15, 15, 5, 5);
        expect(rectangle3.equals(rectangle4)).toBe(false);
    });
});