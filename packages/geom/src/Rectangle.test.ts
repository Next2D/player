import { Rectangle } from "./Rectangle";
import { Point } from "./Point";
import { describe, expect, it } from "vitest";

describe("Rectangle.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        expect(new Rectangle().namespace).toBe("next2d.geom.Rectangle");
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
        expect(rectangle.x).toBe(50);
        expect(rectangle.y).toBe(160);
        expect(rectangle.width).toBe(100);
        expect(rectangle.height).toBe(-10);
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
        expect(rectangle.x).toBe(-50);
        expect(rectangle.y).toBe(160);
        expect(rectangle.width).toBe(-100);
        expect(rectangle.height).toBe(-310);
        expect(rectangle.bottom).toBe(-150);
        expect(rectangle.y).toBe(160);
    });

    it("right test case1", () =>
    {
        const rectangle = new Rectangle(50, 100, 100, 100);
        expect(rectangle.right).toBe(150);

        // success
        rectangle.right = 20;
        expect(rectangle.x).toBe(50);
        expect(rectangle.y).toBe(100);
        expect(rectangle.width).toBe(-30);
        expect(rectangle.height).toBe(100);

        rectangle.right = 0;
        expect(rectangle.right).toBe(0);
    });

    it("right test case2", () =>
    {
        const rectangle = new Rectangle(50, -100, -100, -100);
        expect(rectangle.right).toBe(-50);

        // success
        rectangle.right = 20;
        expect(rectangle.x).toBe(50);
        expect(rectangle.y).toBe(-100);
        expect(rectangle.width).toBe(-30);
        expect(rectangle.height).toBe(-100);

        rectangle.right = 0;
        expect(rectangle.right).toBe(0);
    });

    it("bottom test case1", () =>
    {
        const rectangle = new Rectangle(0, 100, 100, 100);
        expect(rectangle.bottom).toBe(200);

        // success
        rectangle.bottom = 50;
        expect(rectangle.x).toBe(0);
        expect(rectangle.y).toBe(100);
        expect(rectangle.width).toBe(100);
        expect(rectangle.height).toBe(-50);

        rectangle.bottom = 0;
        expect(rectangle.height).toBe(-100);
    });

    it("bottom test case2", () =>
    {
        const rectangle = new Rectangle(0, -100, -100, -100);
        expect(rectangle.bottom).toBe(-200);

        // success
        rectangle.bottom = -50;
        expect(rectangle.x).toBe(0);
        expect(rectangle.y).toBe(-100);
        expect(rectangle.width).toBe(-100);
        expect(rectangle.height).toBe(50);

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
        expect(rectangle.x).toBe(160);
        expect(rectangle.y).toBe(50);
        expect(rectangle.width).toBe(-10);
        expect(rectangle.height).toBe(100);
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
        expect(rectangle.x).toBe(160);
        expect(rectangle.y).toBe(-50);
        expect(rectangle.width).toBe(-310);
        expect(rectangle.height).toBe(-100);
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
        expect(point.x).toBe(110);
        expect(point.y).toBe(150);

        rectangle.bottomRight = new Point(10 ,10);
        expect(rectangle.x).toBe(30);
        expect(rectangle.y).toBe(50);
        expect(rectangle.width).toBe(-20);
        expect(rectangle.height).toBe(-40);
    });

    it("bottomRight test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.bottomRight;
        expect(point.x).toBe(-110);
        expect(point.y).toBe(-150);

        rectangle.bottomRight = new Point(10 ,10);
        expect(rectangle.x).toBe(-30);
        expect(rectangle.y).toBe(-50);
        expect(rectangle.width).toBe(40);
        expect(rectangle.height).toBe(60);
    });

    it("topLeft test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        const point = rectangle.topLeft;
        expect(point.x).toBe(30);
        expect(point.y).toBe(50);

        rectangle.topLeft = new Point(10 ,10);
        expect(rectangle.x).toBe(10);
        expect(rectangle.y).toBe(10);
        expect(rectangle.width).toBe(100);
        expect(rectangle.height).toBe(140);
    });

    it("topLeft test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.topLeft;
        expect(point.x).toBe(-30);
        expect(point.y).toBe(-50);

        rectangle.topLeft = new Point(10 ,10);
        expect(rectangle.x).toBe(10);
        expect(rectangle.y).toBe(10);
        expect(rectangle.width).toBe(-120);
        expect(rectangle.height).toBe(-160);
    });

    it("size test case1", () =>
    {
        const rectangle = new Rectangle(30, 50, 80, 100);
        const point = rectangle.size;
        expect(point.x).toBe(80);
        expect(point.y).toBe(100);

        rectangle.size = new Point(10 ,10);
        expect(rectangle.x).toBe(30);
        expect(rectangle.y).toBe(50);
        expect(rectangle.width).toBe(10);
        expect(rectangle.height).toBe(10);
    });

    it("size test case2", () =>
    {
        const rectangle = new Rectangle(-30, -50, -80, -100);
        const point = rectangle.size;
        expect(point.x).toBe(-80);
        expect(point.y).toBe(-100);

        rectangle.size = new Point(10 ,10);
        expect(rectangle.x).toBe(-30);
        expect(rectangle.y).toBe(-50);
        expect(rectangle.width).toBe(10);
        expect(rectangle.height).toBe(10);
    });
});