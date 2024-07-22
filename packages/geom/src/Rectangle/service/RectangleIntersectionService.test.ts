import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js intersection test", () =>
{
    it("intersection test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(5, 5, 5, 5);
        const rectangle3 = rectangle1.intersection(rectangle2);
        expect(rectangle3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        const rectangle4 = new Rectangle(10, 10, 20, 20);
        const rectangle5 = new Rectangle(15, 15, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);
        expect(rectangle6.toString()).toBe("(x=15, y=15, w=5, h=5)");

        const rectangle7 = new Rectangle(10, 10, 20, 20);
        const rectangle8 = new Rectangle(5, 5, 25, 25);
        const rectangle9 = rectangle7.intersection(rectangle8);
        expect(rectangle9.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("intersection test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        const rectangle2 = new Rectangle(-5, -5, -5, -5);
        const rectangle3 = rectangle1.intersection(rectangle2);
        expect(rectangle3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        const rectangle4 = new Rectangle(-10, -10, -20, -20);
        const rectangle5 = new Rectangle(-15, -15, -5, -5);
        const rectangle6 = rectangle4.intersection(rectangle5);
        expect(rectangle6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        const rectangle7 = new Rectangle(-10, -10, -20, -20);
        const rectangle8 = new Rectangle(-5, -5, -25, -25);
        const rectangle9 = rectangle7.intersection(rectangle8);
        expect(rectangle9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("intersection test case3", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 20, 20);
        const rectangle2 = new Rectangle(-5, -5, 5, 5);
        const rectangle3 = rectangle1.intersection(rectangle2);
        expect(rectangle3.toString()).toBe("(x=-5, y=-5, w=5, h=5)");

        const rectangle4 = new Rectangle(-10, -10, 20, 20);
        const rectangle5 = new Rectangle(-15, -15, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);
        expect(rectangle6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        const rectangle7 = new Rectangle(-10, -10, 20, 20);
        const rectangle8 = new Rectangle(-5, -5, 25, 25);
        const rectangle9 = rectangle7.intersection(rectangle8);
        expect(rectangle9.toString()).toBe("(x=-5, y=-5, w=15, h=15)");
    });

    it("intersection test case4", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 20, 20);
        const rectangle2 = new Rectangle(-10, -10, 0, 10);
        const rectangle3 = rectangle1.intersection(rectangle2);
        expect(rectangle3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        const rectangle4 = new Rectangle(-10, -10, 20, 20);
        const rectangle5 = new Rectangle(-10, -10, 5, 5);
        const rectangle6 = rectangle4.intersection(rectangle5);
        expect(rectangle6.toString()).toBe("(x=-10, y=-10, w=5, h=5)");

        const rectangle7 = new Rectangle(-5, -5, -25, -25);
        const rectangle8 = new Rectangle(-10, -10, -20, -20);
        const rectangle9 = rectangle7.intersection(rectangle8);
        expect(rectangle9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});