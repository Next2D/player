import { Rectangle } from "../../../src/player/next2d/geom/Rectangle";
import { Point } from "../../../src/player/next2d/geom/Point";
import {$SHORT_INT_MAX, $SHORT_INT_MIN} from "../../../src/player/util/RenderUtil";

describe("Rectangle.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const object = new Rectangle();
        expect(object.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("toString test2 success", () =>
    {
        const object = new Rectangle(1, 2, 3, 4);
        expect(object.toString()).toBe("(x=1, y=2, w=3, h=4)");
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
        const object = new Rectangle();
        expect(object.namespace).toBe("next2d.geom.Rectangle");
    });

    it("namespace test static", () =>
    {
        expect(Rectangle.namespace).toBe("next2d.geom.Rectangle");
    });

});

describe("Rectangle.js property test", () =>
{
    it("top test1", () =>
    {

        let r = new Rectangle(50, 50, 100, 100);
        expect(r.top).toBe(50);
        expect(r.bottom).toBe(150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=50, y=160, w=100, h=-10)");
        expect(r.bottom).toBe(150);
        expect(r.y).toBe(160);

        // @ts-ignore
        r.top = "a";
        expect(r.y).toBe(0);
        expect(r.height).toBe(0);
    });

    it("top test2", () =>
    {

        let r = new Rectangle(-50, -50, -100, -100);
        expect(r.top).toBe(-50);
        expect(r.bottom).toBe(-150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=-50, y=160, w=-100, h=-310)");
        expect(r.bottom).toBe(-150);
        expect(r.y).toBe(160);

        // @ts-ignore
        r.top = "a";
        expect(r.y).toBe(0);
        expect(r.height).toBe(0);
    });

    it("right test1", () =>
    {

        let r = new Rectangle(50, 100, 100, 100);
        expect(r.right).toBe(150);

        // success
        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=100, w=-30, h=100)");

        // @ts-ignore
        r.right = "a";
        expect(r.right).toBe(50);
    });

    it("right test2", () =>
    {

        let r = new Rectangle(50, -100, -100, -100);
        expect(r.right).toBe(-50);

        // success

        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=-100, w=-30, h=-100)");

        // @ts-ignore
        r.right = "a";
        expect(r.right).toBe(50);
    });

    it("bottom test1", () =>
    {

        let r = new Rectangle(0, 100, 100, 100);
        expect(r.bottom).toBe(200);

        // success
        r.bottom = 50;
        expect(r.toString()).toBe("(x=0, y=100, w=100, h=-50)");

        // @ts-ignore
        r.bottom = "a";
        expect(r.height).toBe(0);
    });

    it("bottom test2", () =>
    {

        let r = new Rectangle(0, -100, -100, -100);
        expect(r.bottom).toBe(-200);

        // success
        r.bottom = -50;
        expect(r.toString()).toBe("(x=0, y=-100, w=-100, h=50)");

        // @ts-ignore
        r.bottom = "a";
        expect(r.height).toBe(0);
    });

    it("left test1", () =>
    {

        let r = new Rectangle(50, 50, 100, 100);
        expect(r.left).toBe(50);
        expect(r.right).toBe(150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=50, w=-10, h=100)");
        expect(r.right).toBe(150);
        expect(r.x).toBe(160);

        // @ts-ignore
        r.left = "a";
        expect(r.x).toBe(0);
        expect(r.width).toBe(0);
    });

    it("left test2", () =>
    {

        let r = new Rectangle(-50, -50, -100, -100);
        expect(r.left).toBe(-50);
        expect(r.right).toBe(-150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=-50, w=-310, h=-100)");
        expect(r.right).toBe(-150);
        expect(r.x).toBe(160);

        // @ts-ignore
        r.left = "a";
        expect(r.x).toBe(0);
        expect(r.width).toBe(0);
    });

    it("bottomRight test1", () =>
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.bottomRight;
        expect(p.toString()).toBe("(x=110, y=150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=-20, h=-40)");
    });

    it("bottomRight test2", () =>
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.bottomRight;
        expect(p.toString()).toBe("(x=-110, y=-150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=40, h=60)");
    });

    it("topLeft test1", () =>
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.topLeft;
        expect(p.toString()).toBe("(x=30, y=50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=100, h=140)");
    });

    it("topLeft test2", () =>
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.topLeft;
        expect(p.toString()).toBe("(x=-30, y=-50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=-120, h=-160)");
    });

    it("size test1", () =>
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.size;
        expect(p.toString()).toBe("(x=80, y=100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=10, h=10)");
    });

    it("size test2", () =>
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.size;
        expect(p.toString()).toBe("(x=-80, y=-100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=10, h=10)");
    });
});

describe("Rectangle.js clone test", () =>
{
    it("clone test", () =>
    {
        let r1 = new Rectangle(30, 50, 80, 100);
        let r2 = r1.clone();
        r2.x   = 100;

        expect(r1.toString()).toBe("(x=30, y=50, w=80, h=100)");
        expect(r2.toString()).toBe("(x=100, y=50, w=80, h=100)");
    });
});

describe("Rectangle.js contains test", () =>
{

    it("contains test1", () =>
    {
        let r = new Rectangle(30, 50, 80, 100);
        expect(r.contains(30, 50)).toBe(true);
        expect(r.contains(110, 150)).toBe(false);
        expect(r.contains(109, 149)).toBe(true);
        expect(r.contains(20, 40)).toBe(false);
    });

    it("contains test2", () =>
    {
        let r = new Rectangle(0, 0, 0, 0);
        expect(r.contains(0, 0)).toBe(false);
        // @ts-ignore
        expect(r.contains("a", 0)).toBe(false);
        // @ts-ignore
        expect(r.contains(0, "a")).toBe(false);
    });

    it("contains test3", () =>
    {
        let r = new Rectangle(0, 0, 1, 1);
        expect(r.contains(0, 0)).toBe(true);
        expect(r.contains(0.000001, 0.000001)).toBe(true);
        expect(r.contains(0.999999, 0.999999)).toBe(true);
        expect(r.contains(1, 0)).toBe(false);
        expect(r.contains(0, 1)).toBe(false);
        expect(r.contains(1, 1)).toBe(false);
    });

    it("contains test4", () =>
    {
        let r = new Rectangle(-1, -1, 1, 1);
        expect(r.contains(0, 0)).toBe(false);
        expect(r.contains(-1, -1)).toBe(true);
        expect(r.contains(-1, -0.5)).toBe(true);
        expect(r.contains(-0.5, -1)).toBe(true);
    });

});

describe("Rectangle.js containsPoint test", () =>
{
    it("containsPoint test1", () =>
    {
        let r = new Rectangle(30, 50, 80, 100);

        let p1 = new Point(30, 50);
        expect(r.containsPoint(p1)).toBe(true);

        let p2 = new Point(110, 150);
        expect(r.containsPoint(p2)).toBe(false);

        let p3 = new Point(109, 149);
        expect(r.containsPoint(p3)).toBe(true);

        let p4 = new Point(20, 40);
        expect(r.containsPoint(p4)).toBe(false);
    });

    it("containsPoint test2", () =>
    {
        let r = new Rectangle(-30, -50, -80, -100);

        let p1 = new Point(-30, -50);
        expect(r.containsPoint(p1)).toBe(false);

        let p2 = new Point(-110, -150);
        expect(r.containsPoint(p2)).toBe(false);

        let p3 = new Point(-109, -149);
        expect(r.containsPoint(p3)).toBe(false);

        let p5 = new Point(110, 150);
        expect(r.containsPoint(p5)).toBe(false);

        let p6 = new Point(109, 149);
        expect(r.containsPoint(p6)).toBe(false);

        let p4 = new Point(-20, -40);
        expect(r.containsPoint(p4)).toBe(false);
    });
});

describe("Rectangle.js containsRect test", () =>
{
    it("containsRect test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(15, 15, 5, 5);
        expect(r1.containsRect(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(10, 10, 20, 20);
        expect(r3.containsRect(r4)).toBe(true);

        let r5 = new Rectangle(10, 10, 20, 20);
        let r6 = new Rectangle(9, 9, 20, 20);
        expect(r5.containsRect(r6)).toBe(false);

        let r7 = new Rectangle(10, 10, 20, 20);
        let r8 = new Rectangle(15, 15, 20, 20);
        expect(r7.containsRect(r8)).toBe(false);
    });

    it("containsRect test2", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let r2 = new Rectangle(-15, -15, -5, -5);
        expect(r1.containsRect(r2)).toBe(false);

        let r3 = new Rectangle(-10, -10, 20, 20);
        let r4 = new Rectangle(-15, -15, 5, 5);
        expect(r3.containsRect(r4)).toBe(false);
    });
});

describe("Rectangle.js copyFrom test", () =>
{
    it("copyFrom test", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(15, 15, 5, 5);

        r1.copyFrom(r2);
        expect(r1.toString()).toBe("(x=15, y=15, w=5, h=5)");
        expect(r2.toString()).toBe("(x=15, y=15, w=5, h=5)");

        r1.x      = 10;
        r1.y      = 10;
        r1.width  = 20;
        r1.height = 20;
        expect(r1.toString()).toBe("(x=10, y=10, w=20, h=20)");
        expect(r2.toString()).toBe("(x=15, y=15, w=5, h=5)");
    });
});

describe("Rectangle.js equals test", () =>
{
    it("equals test", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(10, 10, 20, 20);
        expect(r1.equals(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(15, 15, 5, 5);
        expect(r3.equals(r4)).toBe(false);
    });
});

describe("Rectangle.js inflate test", () =>
{
    it("inflate test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        let r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflate test2", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        let r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(-20, -20);
        expect(r2.toString()).toBe("(x=30, y=30, w=-20, h=-20)");
    });

    it("inflate test3", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        // @ts-ignore
        r1.inflate("a", 10);
        expect(r1.toString()).toBe("(x=0, y=-20, w=0, h=0)");

        // @ts-ignore
        let r2 = new Rectangle("a", -10, -20, -20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=-20, y=-30, w=20, h=20)");

        // @ts-ignore
        let r3 = new Rectangle(-10, "a", -20, -20);
        r3.inflate(20, 20);
        expect(r3.toString()).toBe("(x=-30, y=-20, w=20, h=20)");

        // @ts-ignore
        let r4 = new Rectangle(-10, -10, "a", -20);
        r4.inflate(20, 20);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=40, h=20)");
    });
});

describe("Rectangle.js inflatePoint test", () =>
{
    it("inflatePoint test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let p1 = new Point(10, 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        let r2 = new Rectangle(10, 10, 20, 20);
        let p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflatePoint test2", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let p1 = new Point(10, 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        let r2 = new Rectangle(-10, -10, 20, 20);
        let p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-30, y=-30, w=60, h=60)");
    });

    it("inflatePoint test3", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        // @ts-ignore
        let p1 = new Point("a", 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=-10, y=-20, w=-20, h=0)");

        // @ts-ignore
        let r2 = new Rectangle("a", -10, -20, -20);
        let p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-20, y=-30, w=20, h=20)");

        // @ts-ignore
        let r3 = new Rectangle(-10, "a", -20, -20);
        let p3 = new Point(20, 20);
        r3.inflatePoint(p3);
        expect(r3.toString()).toBe("(x=-30, y=-20, w=20, h=20)");

        // @ts-ignore
        let r4 = new Rectangle(-10, -10, "a", -20);
        let p4 = new Point(20, 20);
        r4.inflatePoint(p4);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=40, h=20)");
    });
});

describe("Rectangle.js intersection test", () =>
{
    it("intersection test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 5, 5, 5);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r4 = new Rectangle(10, 10, 20, 20);
        let r5 = new Rectangle(15, 15, 5, 5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=15, y=15, w=5, h=5)");

        let r7 = new Rectangle(10, 10, 20, 20);
        let r8 = new Rectangle(5, 5, 25, 25);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("intersection test2", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let r2 = new Rectangle(-5, -5, -5, -5);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r4 = new Rectangle(-10, -10, -20, -20);
        let r5 = new Rectangle(-15, -15, -5, -5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r7 = new Rectangle(-10, -10, -20, -20);
        let r8 = new Rectangle(-5, -5, -25, -25);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("intersection test3", () =>
    {
        let r1 = new Rectangle(-10, -10, 20, 20);
        let r2 = new Rectangle(-5, -5, 5, 5);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=-5, y=-5, w=5, h=5)");

        let r4 = new Rectangle(-10, -10, 20, 20);
        let r5 = new Rectangle(-15, -15, 5, 5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r7 = new Rectangle(-10, -10, 20, 20);
        let r8 = new Rectangle(-5, -5, 25, 25);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=-5, y=-5, w=15, h=15)");
    });

    it("intersection test4", () =>
    {
        let r1 = new Rectangle(-10, -10, 20, 20);
        let r2 = new Rectangle(-10, -10, 0, 10);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r4 = new Rectangle(-10, -10, 20, 20);
        let r5 = new Rectangle(-10, -10, 5, 5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=-10, y=-10, w=5, h=5)");

        let r7 = new Rectangle(-5, -5, -25, -25);
        let r8 = new Rectangle(-10, -10, -20, -20);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("intersection test5", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(15, 15, 5, 5);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=15, y=15, w=5, h=5)");

        // @ts-ignore
        let r4 = new Rectangle(10, 10, "a", 20);
        let r5 = new Rectangle(15, 15, 5, 5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r7 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r8 = new Rectangle(5, "a", 25, 25);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=10, y=10, w=20, h=15)");

        let r10 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r11 = new Rectangle(5, 5, 25, "a");
        let r12 = r10.intersection(r11);
        expect(r12.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js intersects test", () =>
{
    it("intersects test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 5, 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test2", () =>
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let r2 = new Rectangle(-5, -5, -25, -25);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(-10, -10, 20, 20);
        let r4 = new Rectangle(-5, -5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test3", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 5, 25, 25);
        expect(r1.intersects(r2)).toBe(true);

        // @ts-ignore
        let r3 = new Rectangle(10, 10, "a", 20);
        let r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test4", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle(5, "a", 25, 25);

        expect(r1.intersects(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, 5, 25, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test5", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle(5, "a", 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, 5, 5, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test6", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle(5, "a", -5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, 5, 100, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test7", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test8", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        // @ts-ignore
        let r3 = new Rectangle(10, "a", 20, 20);
        let r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test9", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle("a", 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test10", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(true);

        // @ts-ignore
        let r3 = new Rectangle(10, "a", 20, 20);
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test11", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle("a", 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test12", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        // @ts-ignore
        let r3 = new Rectangle(10, 10, 20, "a");
        let r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test13", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle(5, 40, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, 40, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test14", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        // @ts-ignore
        let r3 = new Rectangle(10, 10, 20, "a");
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test15", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r2 = new Rectangle(5, 15, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        let r4 = new Rectangle(5, 15, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

});

describe("Rectangle.js isEmpty test", () =>
{
    it("isEmpty test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);
        expect(r1.isEmpty()).toBe(false);
        expect(r2.isEmpty()).toBe(true);
    });

    it("isEmpty test2", () =>
    {
        let r1 = new Rectangle(10, 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test3", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test4", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test5", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test6", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test7", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, 20, "a");
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test8", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test9", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test10", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test11", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, 0, "a");
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test12", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 0);
        expect(r1.isEmpty()).toBe(true);
    });
});

describe("Rectangle.js offset test", () =>
{
    it("offset test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset(60, 30);

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        // @ts-ignore
        r2.offset("a", 30);

        expect(r1.toString()).toBe("(x=5, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=0, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        // @ts-ignore
        r2.offset(60, "a");

        expect(r1.toString()).toBe("(x=15, y=18, w=0, h=20)");
        expect(r2.toString()).toBe("(x=5, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js offsetPoint test", () =>
{
    it("offsetPoint test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point(60, 30));

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        // @ts-ignore
        r2.offsetPoint(new Point("a", 30));

        expect(r1.toString()).toBe("(x=5, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=-55, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        // @ts-ignore
        r2.offsetPoint(new Point(60, "a"));

        expect(r1.toString()).toBe("(x=15, y=18, w=0, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-55, w=0, h=0)");
    });
});

describe("Rectangle.js setEmpty test", () =>
{
    it("setEmpty test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setEmpty();
        r2.setEmpty();

        expect(r1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(r2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("setEmpty test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setEmpty();
        r2.setEmpty();

        expect(r1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(r2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js setTo test", () =>
{
    it("setTo test1", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setTo(5, 5, 5, 5);
        r2.setTo(10, 10, 10, 10);

        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
        expect(r2.toString()).toBe("(x=10, y=10, w=10, h=10)");
    });

    it("setTo test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test3", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, "a", 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test4", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test5", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, 20, "a");
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test6", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        r1.setTo("a", 5, 5, 5);
        expect(r1.toString()).toBe("(x=0, y=5, w=5, h=5)");
    });

    it("setTo test7", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        r1.setTo(5, "a", 5, 5);
        expect(r1.toString()).toBe("(x=5, y=0, w=5, h=5)");
    });

    it("setTo test8", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        r1.setTo(5, 5, "a", 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=0, h=5)");
    });

    it("setTo test9", () =>
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        // @ts-ignore
        r1.setTo(5, 5, 5, "a");
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=0)");
    });
});

describe("Rectangle.js union test", () =>
{
    it("union test1", () =>
    {
        let r1 = new Rectangle(10, 10, 0, 10);
        let r2 = new Rectangle(-55, -25, 0, 20);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-55, y=-25, w=0, h=20)");

        let r4 = new Rectangle(10, 10, 10, 10);
        let r5 = new Rectangle(-55, -25, 0, 20);
        let r6 = r4.union(r5);
        expect(r6.toString()).toBe("(x=10, y=10, w=10, h=10)");

        let r7 = new Rectangle(10, 10, 10, 10);
        let r8 = new Rectangle(-55, -25, 20, 20);
        let r9 = r7.union(r8);
        expect(r9.toString()).toBe("(x=-55, y=-25, w=75, h=45)");
    });

    it("union test2", () =>
    {
        let r1 = new Rectangle(10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test3", () =>
    {
        let r1 = new Rectangle(-10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test4", () =>
    {
        let r1 = new Rectangle(10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test5", () =>
    {
        let r1 = new Rectangle(-10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test6", () =>
    {
        let r1 = new Rectangle(10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test7", () =>
    {
        let r1 = new Rectangle(-10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test8", () =>
    {
        let r1 = new Rectangle(10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test9", () =>
    {
        let r1 = new Rectangle(-10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle("a", 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=0, y=10, w=30, h=20)");
    });

    it("union test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, "a", 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=0, w=20, h=30)");
    });

    it("union test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, "a", 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=20, y=20, w=10, h=10)");
    });

    it("union test2", () =>
    {
        // @ts-ignore
        let r1 = new Rectangle(10, 10, 10, "a");
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=20, y=20, w=10, h=10)");
    });
});

describe("Rectangle.js bottom test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.bottom).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = null;
        expect(r.bottom).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = undefined;
        expect(r.bottom).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = true;
        expect(r.bottom).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = "";
        expect(r.bottom).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = "abc";
        expect(r.bottom).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.bottom = 0;
        expect(r.bottom).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.bottom = 1;
        expect(r.bottom).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.bottom = 500;
        expect(r.bottom).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.bottom = 50000000000000000;
        expect(r.bottom).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.bottom = -1;
        expect(r.bottom).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.bottom = -500;
        expect(r.bottom).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.bottom = -50000000000000000;
        expect(r.bottom).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = { "a":0 };
        expect(r.bottom).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = function a() {};
        expect(r.bottom).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = [1];
        expect(r.bottom).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = [1,2];
        expect(r.bottom).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = {};
        expect(r.bottom).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = { "toString":() => { return 1 } };
        expect(r.bottom).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = { "toString":() => { return "1" } };
        expect(r.bottom).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.bottom = { "toString":() => { return "1a" } };
        expect(r.bottom).toBe(0);
    });

});

describe("Rectangle.js height test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.height).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = null;
        expect(r.height).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = undefined;
        expect(r.height).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = true;
        expect(r.height).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = "";
        expect(r.height).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = "abc";
        expect(r.height).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.height = 0;
        expect(r.height).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.height = 1;
        expect(r.height).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.height = 500;
        expect(r.height).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.height = 50000000000000000;
        expect(r.height).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.height = -1;
        expect(r.height).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.height = -500;
        expect(r.height).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.height = -50000000000000000;
        expect(r.height).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = { "a":0 };
        expect(r.height).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = function a() {};
        expect(r.height).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = [1];
        expect(r.height).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = [1,2];
        expect(r.height).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = {};
        expect(r.height).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = { "toString":() => { return 1 } };
        expect(r.height).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = { "toString":() => { return "1" } };
        expect(r.height).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.height = { "toString":() => { return "1a" } };
        expect(r.height).toBe(0);
    });

});

describe("Rectangle.js left test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.left).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = null;
        expect(r.left).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = undefined;
        expect(r.left).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = true;
        expect(r.left).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = "";
        expect(r.left).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = "abc";
        expect(r.left).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.left = 0;
        expect(r.left).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.left = 1;
        expect(r.left).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.left = 500;
        expect(r.left).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.left = 50000000000000000;
        expect(r.left).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.left = -1;
        expect(r.left).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.left = -500;
        expect(r.left).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.left = -50000000000000000;
        expect(r.left).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = { "a":0 };
        expect(r.left).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = function a() {};
        expect(r.left).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = [1];
        expect(r.left).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = [1,2];
        expect(r.left).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = {};
        expect(r.left).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = { "toString":() => { return 1 } };
        expect(r.left).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = { "toString":() => { return "1" } };
        expect(r.left).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.left = { "toString":() => { return "1a" } };
        expect(r.left).toBe(0);
    });

});

describe("Rectangle.js right test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.right).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = null;
        expect(r.right).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = undefined;
        expect(r.right).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = true;
        expect(r.right).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = "";
        expect(r.right).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = "abc";
        expect(r.right).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.right = 0;
        expect(r.right).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.right = 1;
        expect(r.right).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.right = 500;
        expect(r.right).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.right = 50000000000000000;
        expect(r.right).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.right = -1;
        expect(r.right).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.right = -500;
        expect(r.right).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.right = -50000000000000000;
        expect(r.right).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = { "a":0 };
        expect(r.right).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = function a() {};
        expect(r.right).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = [1];
        expect(r.right).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = [1,2];
        expect(r.right).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = {};
        expect(r.right).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = { "toString":() => { return 1 } };
        expect(r.right).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = { "toString":() => { return "1" } };
        expect(r.right).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.right = { "toString":() => { return "1a" } };
        expect(r.right).toBe(0);
    });

});

describe("Rectangle.js top test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.top).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = null;
        expect(r.top).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = undefined;
        expect(r.top).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = true;
        expect(r.top).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = "";
        expect(r.top).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = "abc";
        expect(r.top).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.top = 0;
        expect(r.top).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.top = 1;
        expect(r.top).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.top = 500;
        expect(r.top).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.top = 50000000000000000;
        expect(r.top).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.top = -1;
        expect(r.top).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.top = -500;
        expect(r.top).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.top = -50000000000000000;
        expect(r.top).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = { "a":0 };
        expect(r.top).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = function a() {};
        expect(r.top).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = [1];
        expect(r.top).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = [1,2];
        expect(r.top).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = {};
        expect(r.top).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = { "toString":() => { return 1 } };
        expect(r.top).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = { "toString":() => { return "1" } };
        expect(r.top).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.top = { "toString":() => { return "1a" } };
        expect(r.top).toBe(0);
    });

});

describe("Rectangle.js width test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.width).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = null;
        expect(r.width).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = undefined;
        expect(r.width).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = true;
        expect(r.width).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = "";
        expect(r.width).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = "abc";
        expect(r.width).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.width = 0;
        expect(r.width).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.width = 1;
        expect(r.width).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.width = 500;
        expect(r.width).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.width = 50000000000000000;
        expect(r.width).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.width = -1;
        expect(r.width).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.width = -500;
        expect(r.width).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.width = -50000000000000000;
        expect(r.width).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = { "a":0 };
        expect(r.width).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = function a() {};
        expect(r.width).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = [1];
        expect(r.width).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = [1,2];
        expect(r.width).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = {};
        expect(r.width).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = { "toString":() => { return 1 } };
        expect(r.width).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = { "toString":() => { return "1" } };
        expect(r.width).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.width = { "toString":() => { return "1a" } };
        expect(r.width).toBe(0);
    });

});

describe("Rectangle.js x test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.x).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = null;
        expect(r.x).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = undefined;
        expect(r.x).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = true;
        expect(r.x).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = "";
        expect(r.x).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = "abc";
        expect(r.x).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.x = 0;
        expect(r.x).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.x = 1;
        expect(r.x).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.x = 500;
        expect(r.x).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.x = 50000000000000000;
        expect(r.x).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.x = -1;
        expect(r.x).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.x = -500;
        expect(r.x).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.x = -50000000000000000;
        expect(r.x).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = { "a":0 };
        expect(r.x).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = function a() {};
        expect(r.x).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = [1];
        expect(r.x).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = [1,2];
        expect(r.x).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = {};
        expect(r.x).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = { "toString":() => { return 1 } };
        expect(r.x).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = { "toString":() => { return "1" } };
        expect(r.x).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.x = { "toString":() => { return "1a" } };
        expect(r.x).toBe(0);
    });

});

describe("Rectangle.js y test", () =>
{

    it("default test case1", () =>
    {
        let r = new Rectangle();
        expect(r.y).toBe(0);
    });

    it("default test case2", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = null;
        expect(r.y).toBe(0);
    });

    it("default test case3", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = undefined;
        expect(r.y).toBe(0);
    });

    it("default test case4", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = true;
        expect(r.y).toBe(1);
    });

    it("default test case5", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = "";
        expect(r.y).toBe(0);
    });

    it("default test case6", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = "abc";
        expect(r.y).toBe(0);
    });

    it("default test case7", () =>
    {
        let r = new Rectangle();
        r.y = 0;
        expect(r.y).toBe(0);
    });

    it("default test case8", () =>
    {
        let r = new Rectangle();
        r.y = 1;
        expect(r.y).toBe(1);
    });

    it("default test case9", () =>
    {
        let r = new Rectangle();
        r.y = 500;
        expect(r.y).toBe(500);
    });

    it("default test case10", () =>
    {
        let r = new Rectangle();
        r.y = 50000000000000000;
        expect(r.y).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let r = new Rectangle();
        r.y = -1;
        expect(r.y).toBe(-1);
    });

    it("default test case12", () =>
    {
        let r = new Rectangle();
        r.y = -500;
        expect(r.y).toBe(-500);
    });

    it("default test case13", () =>
    {
        let r = new Rectangle();
        r.y = -50000000000000000;
        expect(r.y).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = { "a":0 };
        expect(r.y).toBe(0);
    });

    it("default test case15", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = function a() {};
        expect(r.y).toBe(0);
    });

    it("default test case16", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = [1];
        expect(r.y).toBe(1);
    });

    it("default test case17", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = [1,2];
        expect(r.y).toBe(0);
    });

    it("default test case18", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = {};
        expect(r.y).toBe(0);
    });

    it("default test case19", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = { "toString":() => { return 1 } };
        expect(r.y).toBe(1);
    });

    it("default test case20", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = { "toString":() => { return "1" } };
        expect(r.y).toBe(1);
    });

    it("default test case21", () =>
    {
        let r = new Rectangle();
        // @ts-ignore
        r.y = { "toString":() => { return "1a" } };
        expect(r.y).toBe(0);
    });

});