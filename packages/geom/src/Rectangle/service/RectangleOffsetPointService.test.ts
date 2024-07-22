import { Point } from "../../Point";
import { Rectangle } from "../../Rectangle";
import { describe, expect, it } from "vitest";

describe("Rectangle.js offsetPoint test", () =>
{
    it("offsetPoint test case1", () =>
    {
        const rectangle1 = new Rectangle(10, 10, 20, 20);
        const rectangle2 = new Rectangle(-55, -55, 0, 0);

        rectangle1.offsetPoint(new Point(5, 8));
        rectangle2.offsetPoint(new Point(60, 30));

        expect(rectangle1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(rectangle2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

});