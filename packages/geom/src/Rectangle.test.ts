import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { describe, expect, it } from "vitest";

describe("Rectangle.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const rectangle = new Rectangle();
        expect(rectangle.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("toString test2 success", () =>
    {
        const rectangle = new Rectangle(1, 2, 3, 4);
        expect(rectangle.toString()).toBe("(x=1, y=2, w=3, h=4)");
    });

});

describe("Rectangle.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Rectangle.toString()).toBe("[class Rectangle]");
    });

});

describe("Rectangle.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const rectangle = new Rectangle();
        expect(rectangle.namespace).toBe("next2d.geom.Rectangle");
    });

    it("namespace test static", () =>
    {
        expect(Rectangle.namespace).toBe("next2d.geom.Rectangle");
    });

});

describe("Rectangle.js property test", () =>
{
    it("top test case1", () =>
    {
        const rectangle = new Rectangle(50, 50, 100, 100);
        expect(rectangle.top).toBe(50);
        expect(rectangle.bottom).toBe(150);

        // success
        rectangle.top = 160;
        expect(rectangle.toString()).toBe("(x=50, y=160, w=100, h=-10)");
        expect(rectangle.bottom).toBe(150);
        expect(rectangle.y).toBe(160);

        rectangle.top = 0;
        expect(rectangle.y).toBe(0);
        expect(rectangle.height).toBe(150);
    });

    it("top test case2", () =>
    {
        const rectangle = new Rectangle(-50, -50, -100, -100);
        expect(rectangle.top).toBe(-50);
        expect(rectangle.bottom).toBe(-150);

        // success
        rectangle.top = 160;
        expect(rectangle.toString()).toBe("(x=-50, y=160, w=-100, h=-310)");
        expect(rectangle.bottom).toBe(-150);
        expect(rectangle.y).toBe(160);
    });

    it("right test case1", () =>
    {
        const rectangle = new Rectangle(50, 100, 100, 100);
        expect(rectangle.right).toBe(150);

        // success
        rectangle.right = 20;
        expect(rectangle.toString()).toBe("(x=50, y=100, w=-30, h=100)");

        rectangle.right = 0;
        expect(rectangle.right).toBe(0);
    });

    it("right test case2", () =>
    {
        const rectangle = new Rectangle(50, -100, -100, -100);
        expect(rectangle.right).toBe(-50);

        // success
        rectangle.right = 20;
        expect(rectangle.toString()).toBe("(x=50, y=-100, w=-30, h=-100)");

        rectangle.right = 0;
        expect(rectangle.right).toBe(0);
    });

    it("bottom test case1", () =>
    {
        const rectangle = new Rectangle(0, 100, 100, 100);
        expect(rectangle.bottom).toBe(200);

        // success
        rectangle.bottom = 50;
        expect(rectangle.toString()).toBe("(x=0, y=100, w=100, h=-50)");

        rectangle.bottom = 0;
        expect(rectangle.height).toBe(-100);
    });

    it("bottom test case2", () =>
    {
        const rectangle = new Rectangle(0, -100, -100, -100);
        expect(rectangle.bottom).toBe(-200);

        // success
        rectangle.bottom = -50;
        expect(rectangle.toString()).toBe("(x=0, y=-100, w=-100, h=50)");

        rectangle.bottom = 0;
        expect(rectangle.height).toBe(100);
    });

    it("left test case1", () =>
    {
        const rectangle = new Rectangle(50, 50, 100, 100);
        expect(rectangle.left).toBe(50);
        expect(rectangle.right).toBe(150);

        // success
        rectangle.left = 160;
        expect(rectangle.toString()).toBe("(x=160, y=50, w=-10, h=100)");
        expect(rectangle.right).toBe(150);
        expect(rectangle.x).toBe(160);

        rectangle.left = 0;
        expect(rectangle.x).toBe(0);
        expect(rectangle.width).toBe(150);
    });

    it("left test case2", () =>
    {
        const rectangle = new Rectangle(-50, -50, -100, -100);
        expect(rectangle.left).toBe(-50);
        expect(rectangle.right).toBe(-150);

        // success
        rectangle.left = 160;
        expect(rectangle.toString()).toBe("(x=160, y=-50, w=-310, h=-100)");
        expect(rectangle.right).toBe(-150);
        expect(rectangle.x).toBe(160);

        rectangle.left = 0;
        expect(rectangle.x).toBe(0);
        expect(rectangle.width).toBe(-150);
    });

    it("bottomRight test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        const point = rectangle.bottomRight;
        expect(point.toString()).toBe("(x=110, y=150)");

        rectangle.bottomRight = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=30, y=50, w=-20, h=-40)");
    });

    it("bottomRight test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.bottomRight;
        expect(point.toString()).toBe("(x=-110, y=-150)");

        rectangle.bottomRight = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=-30, y=-50, w=40, h=60)");
    });

    it("topLeft test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        const point = rectangle.topLeft;
        expect(point.toString()).toBe("(x=30, y=50)");

        rectangle.topLeft = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=10, y=10, w=100, h=140)");
    });

    it("topLeft test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.topLeft;
        expect(point.toString()).toBe("(x=-30, y=-50)");

        rectangle.topLeft = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=10, y=10, w=-120, h=-160)");
    });

    it("size test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        const point = rectangle.size;
        expect(point.toString()).toBe("(x=80, y=100)");

        rectangle.size = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=30, y=50, w=10, h=10)");
    });

    it("size test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.size;
        expect(point.toString()).toBe("(x=-80, y=-100)");

        rectangle.size = new Point(10 ,10);
        expect(rectangle.toString()).toBe("(x=-30, y=-50, w=10, h=10)");
    });
});