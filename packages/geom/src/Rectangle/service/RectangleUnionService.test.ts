import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js union test", () =>
{
    it("union test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 0, 10);
        const rectangle2 = new Rectangle(-55, -25, 0, 20);
        const rectangle3 = rectangle1.union(rectangle2);
        expect(rectangle3.toString()).toBe("(x=-55, y=-25, w=0, h=20)");

        const rectangle4 = new Rectangle(10, 10, 10, 10);
        const rectangle5 = new Rectangle(-55, -25, 0, 20);
        const rectangle6 = rectangle4.union(rectangle5);
        expect(rectangle6.toString()).toBe("(x=10, y=10, w=10, h=10)");

        const rectangle7 = new Rectangle(10, 10, 10, 10);
        const rectangle8 = new Rectangle(-55, -25, 20, 20);
        const rectangle9 = rectangle7.union(rectangle8);
        expect(rectangle9.toString()).toBe("(x=-55, y=-25, w=75, h=45)");
    });

    it("union test case2", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle1.union(rectangle2);
        expect(rectangle3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test case3", () =>
    {
        const rectangle1 = new Rectangle(-10, 10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle1.union(rectangle2);
        expect(rectangle3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test case4", () =>
    {
        const rectangle1 = new Rectangle(10, -10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle1.union(rectangle2);
        expect(rectangle3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test cacse5", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle1.union(rectangle2);
        expect(rectangle3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test case6", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle2.union(rectangle1);
        expect(rectangle3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test case7", () =>
    {
        const rectangle1 = new Rectangle(-10, 10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle2.union(rectangle1);
        expect(rectangle3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test case8", () =>
    {
        const rectangle1 = new Rectangle(10, -10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle2.union(rectangle1);
        expect(rectangle3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test case9", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, 10, 10);
        const rectangle2 = new Rectangle(20, 20, 10, 10);
        const rectangle3 = rectangle2.union(rectangle1);
        expect(rectangle3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });
});