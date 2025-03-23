import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js intersection test", () =>
{
    it("intersection test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(5, 5, 5, 5);
        const rectangle3 = rectangle1.intersection(rectangle2);

        expect(rectangle3.x).toBe(0);
        expect(rectangle3.y).toBe(0);
        expect(rectangle3.width).toBe(0);
        expect(rectangle3.height).toBe(0);

        const rectangle4 = new Rectangle(10, 10, 20, 20);
        const rectangle5 = new Rectangle(15, 15, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);

        expect(rectangle6.x).toBe(15);
        expect(rectangle6.y).toBe(15);
        expect(rectangle6.width).toBe(5);
        expect(rectangle6.height).toBe(5);

        const rectangle7 = new Rectangle(10, 10, 20, 20);
        const rectangle8 = new Rectangle(5, 5, 25, 25);
        const rectangle9 = rectangle7.intersection(rectangle8);

        expect(rectangle9.x).toBe(10);
        expect(rectangle9.y).toBe(10);
        expect(rectangle9.width).toBe(20);
        expect(rectangle9.height).toBe(20);
    });

    it("intersection test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const rectangle2 = new Rectangle(-5, -5, -5, -5);
        const rectangle3 = rectangle1.intersection(rectangle2);

        expect(rectangle3.x).toBe(0);
        expect(rectangle3.y).toBe(0);
        expect(rectangle3.width).toBe(0);
        expect(rectangle3.height).toBe(0);

        const rectangle4 = new Rectangle(-10, -10, -20, -20);
        const rectangle5 = new Rectangle(-15, -15, -5, -5);
        const rectangle6 = rectangle4.intersection(rectangle5);

        expect(rectangle6.x).toBe(0);
        expect(rectangle6.y).toBe(0);
        expect(rectangle6.width).toBe(0);
        expect(rectangle6.height).toBe(0);

        const rectangle7 = new Rectangle(-10, -10, -20, -20);
        const rectangle8 = new Rectangle(-5, -5, -25, -25);
        const rectangle9 = rectangle7.intersection(rectangle8);

        expect(rectangle9.x).toBe(0);
        expect(rectangle9.y).toBe(0);
        expect(rectangle9.width).toBe(0);
        expect(rectangle9.height).toBe(0);
    });

    it("intersection test case3", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 20, 20);
        const rectangle2 = new Rectangle(-5, -5, 5, 5);
        const rectangle3 = rectangle1.intersection(rectangle2);

        expect(rectangle3.x).toBe(-5);
        expect(rectangle3.y).toBe(-5);
        expect(rectangle3.width).toBe(5);
        expect(rectangle3.height).toBe(5);

        const rectangle4 = new Rectangle(-10, -10, 20, 20);
        const rectangle5 = new Rectangle(-15, -15, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);

        expect(rectangle6.x).toBe(0);
        expect(rectangle6.y).toBe(0);
        expect(rectangle6.width).toBe(0);
        expect(rectangle6.height).toBe(0);

        const rectangle7 = new Rectangle(-10, -10, 20, 20);
        const rectangle8 = new Rectangle(-5, -5, 25, 25);
        const rectangle9 = rectangle7.intersection(rectangle8);

        expect(rectangle9.x).toBe(-5);
        expect(rectangle9.y).toBe(-5);
        expect(rectangle9.width).toBe(15);
        expect(rectangle9.height).toBe(15);
    });

    it("intersection test case4", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 20, 20);
        const rectangle2 = new Rectangle(-10, -10, 0, 10);
        const rectangle3 = rectangle1.intersection(rectangle2);

        expect(rectangle3.x).toBe(0);
        expect(rectangle3.y).toBe(0);
        expect(rectangle3.width).toBe(0);
        expect(rectangle3.height).toBe(0);

        const rectangle4 = new Rectangle(-10, -10, 20, 20);
        const rectangle5 = new Rectangle(-10, -10, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);

        expect(rectangle6.x).toBe(-10);
        expect(rectangle6.y).toBe(-10);
        expect(rectangle6.width).toBe(5);
        expect(rectangle6.height).toBe(5);

        const rectangle7 = new Rectangle(-5, -5, -25, -25);
        const rectangle8 = new Rectangle(-10, -10, -20, -20);
        const rectangle9 = rectangle7.intersection(rectangle8);

        expect(rectangle9.x).toBe(0);
        expect(rectangle9.y).toBe(0);
        expect(rectangle9.width).toBe(0);
        expect(rectangle9.height).toBe(0);
    });
});