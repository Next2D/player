import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js contains test", () =>
{
    it("contains test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        expect(rectangle.contains(30, 50)).toBe(true);
        expect(rectangle.contains(110, 150)).toBe(false);
        expect(rectangle.contains(109, 149)).toBe(true);
        expect(rectangle.contains(20, 40)).toBe(false);
    });

    it("contains test case2", () =>
    {
        const rectangle = new Rectangle(0, 0, 0, 0);
        expect(rectangle.contains(0, 0)).toBe(false);
    });

    it("contains test case3", () =>
    {
        const rectangle = new Rectangle(0, 0, 1, 1);
        expect(rectangle.contains(0, 0)).toBe(true);
        expect(rectangle.contains(0.000001, 0.000001)).toBe(true);
        expect(rectangle.contains(0.999999, 0.999999)).toBe(true);
        expect(rectangle.contains(1, 0)).toBe(false);
        expect(rectangle.contains(0, 1)).toBe(false);
        expect(rectangle.contains(1, 1)).toBe(false);
    });

    it("contains test case4", () =>
    {
        const rectangle = new Rectangle(-1, -1, 1, 1);
        expect(rectangle.contains(0, 0)).toBe(false);
        expect(rectangle.contains(-1, -1)).toBe(true);
        expect(rectangle.contains(-1, -0.5)).toBe(true);
        expect(rectangle.contains(-0.5, -1)).toBe(true);
    });

});