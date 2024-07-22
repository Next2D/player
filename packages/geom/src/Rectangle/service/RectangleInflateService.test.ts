import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js inflate test", () =>
{
    it("inflate test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        rectangle1.inflate(10, 10);
        expect(rectangle1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        rectangle2.inflate(20, 20);
        expect(rectangle2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflate test case2", () =>
    {
        const rectangle1 = new Rectangle(-10, -10, -20, -20);
        rectangle1.inflate(10, 10);
        expect(rectangle1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        const rectangle2 = new Rectangle(10, 10, 20, 20);
        rectangle2.inflate(-20, -20);
        expect(rectangle2.toString()).toBe("(x=30, y=30, w=-20, h=-20)");
    });
});