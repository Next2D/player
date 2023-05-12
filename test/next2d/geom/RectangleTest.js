
describe("Rectangle.js toString test", function()
{
    it("toString test1 success", function()
    {
        const object = new Rectangle();
        expect(object.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("toString test2 success", function()
    {
        const object = new Rectangle(1, 2, 3, 4);
        expect(object.toString()).toBe("(x=1, y=2, w=3, h=4)");
    });

});

describe("Rectangle.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Rectangle.toString()).toBe("[class Rectangle]");
    });

});

describe("Rectangle.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Rectangle();
        expect(object.namespace).toBe("next2d.geom.Rectangle");
    });

    it("namespace test static", function()
    {
        expect(Rectangle.namespace).toBe("next2d.geom.Rectangle");
    });

});

describe("Rectangle.js property test", function()
{
    it("top test1", function ()
    {

        let r = new Rectangle(50, 50, 100, 100);
        expect(r.top).toBe(50);
        expect(r.bottom).toBe(150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=50, y=160, w=100, h=-10)");
        expect(r.bottom).toBe(150);
        expect(r.y).toBe(160);

        // error
        r.top = "a";
        expect(r.y).toBe(0);
        expect(r.height).toBe(0);
    });

    it("top test2", function ()
    {

        let r = new Rectangle(-50, -50, -100, -100);
        expect(r.top).toBe(-50);
        expect(r.bottom).toBe(-150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=-50, y=160, w=-100, h=-310)");
        expect(r.bottom).toBe(-150);
        expect(r.y).toBe(160);

        // error
        r.top = "a";
        expect(r.y).toBe(0);
        expect(r.height).toBe(0);
    });

    it("right test1", function ()
    {

        let r = new Rectangle(50, 100, 100, 100);
        expect(r.right).toBe(150);

        // success
        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=100, w=-30, h=100)");

        // error
        r.right = "a";
        expect(r.right).toBe(50);
    });

    it("right test2", function ()
    {

        let r = new Rectangle(50, -100, -100, -100);
        expect(r.right).toBe(-50);

        // success

        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=-100, w=-30, h=-100)");

        // error
        r.right = "a";
        expect(r.right).toBe(50);
    });

    it("bottom test1", function ()
    {

        let r = new Rectangle(0, 100, 100, 100);
        expect(r.bottom).toBe(200);

        // success
        r.bottom = 50;
        expect(r.toString()).toBe("(x=0, y=100, w=100, h=-50)");

        // error
        r.bottom = "a";
        expect(r.height).toBe(0);
    });

    it("bottom test2", function ()
    {

        let r = new Rectangle(0, -100, -100, -100);
        expect(r.bottom).toBe(-200);

        // success
        r.bottom = -50;
        expect(r.toString()).toBe("(x=0, y=-100, w=-100, h=50)");

        // error
        r.bottom = "a";
        expect(r.height).toBe(0);
    });

    it("left test1", function ()
    {

        let r = new Rectangle(50, 50, 100, 100);
        expect(r.left).toBe(50);
        expect(r.right).toBe(150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=50, w=-10, h=100)");
        expect(r.right).toBe(150);
        expect(r.x).toBe(160);

        // error
        r.left = "a";
        expect(r.x).toBe(0);
        expect(r.width).toBe(0);
    });

    it("left test2", function ()
    {

        let r = new Rectangle(-50, -50, -100, -100);
        expect(r.left).toBe(-50);
        expect(r.right).toBe(-150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=-50, w=-310, h=-100)");
        expect(r.right).toBe(-150);
        expect(r.x).toBe(160);

        // error
        r.left = "a";
        expect(r.x).toBe(0);
        expect(r.width).toBe(0);
    });

    it("bottomRight test1", function ()
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.bottomRight;
        expect(p.toString()).toBe("(x=110, y=150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=-20, h=-40)");
    });

    it("bottomRight test2", function ()
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.bottomRight;
        expect(p.toString()).toBe("(x=-110, y=-150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=40, h=60)");
    });

    it("topLeft test1", function ()
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.topLeft;
        expect(p.toString()).toBe("(x=30, y=50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=100, h=140)");
    });

    it("topLeft test2", function ()
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.topLeft;
        expect(p.toString()).toBe("(x=-30, y=-50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=-120, h=-160)");
    });

    it("size test1", function ()
    {

        let r = new Rectangle(30, 50, 80, 100);
        let p = r.size;
        expect(p.toString()).toBe("(x=80, y=100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=10, h=10)");
    });

    it("size test2", function ()
    {

        let r = new Rectangle(-30, -50, -80, -100);
        let p = r.size;
        expect(p.toString()).toBe("(x=-80, y=-100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=10, h=10)");
    });
});

describe("Rectangle.js clone test", function()
{
    it("clone test", function ()
    {
        let r1 = new Rectangle(30, 50, 80, 100);
        let r2 = r1.clone();
        r2.x   = 100;

        expect(r1.toString()).toBe("(x=30, y=50, w=80, h=100)");
        expect(r2.toString()).toBe("(x=100, y=50, w=80, h=100)");
    });
});

describe("Rectangle.js contains test", function()
{

    it("contains test1", function ()
    {
        let r = new Rectangle(30, 50, 80, 100);
        expect(r.contains(30, 50)).toBe(true);
        expect(r.contains(110, 150)).toBe(false);
        expect(r.contains(109, 149)).toBe(true);
        expect(r.contains(20, 40)).toBe(false);
    });

    it("contains test2", function ()
    {
        let r = new Rectangle(0, 0, 0, 0);
        expect(r.contains(0, 0)).toBe(false);
        expect(r.contains("a", 0)).toBe(false);
        expect(r.contains(0, "a")).toBe(false);
    });

    it("contains test3", function ()
    {
        let r = new Rectangle(0, 0, 1, 1);
        expect(r.contains(0, 0)).toBe(true);
        expect(r.contains(0.000001, 0.000001)).toBe(true);
        expect(r.contains(0.999999, 0.999999)).toBe(true);
        expect(r.contains(1, 0)).toBe(false);
        expect(r.contains(0, 1)).toBe(false);
        expect(r.contains(1, 1)).toBe(false);
    });

    it("contains test4", function ()
    {
        let r = new Rectangle(-1, -1, 1, 1);
        expect(r.contains(0, 0)).toBe(false);
        expect(r.contains(-1, -1)).toBe(true);
        expect(r.contains(-1, -0.5)).toBe(true);
        expect(r.contains(-0.5, -1)).toBe(true);
    });

});

describe("Rectangle.js containsPoint test", function()
{
    it("containsPoint test1", function ()
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

    it("containsPoint test2", function ()
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

describe("Rectangle.js containsRect test", function()
{
    it("containsRect test1", function ()
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

    it("containsRect test2", function ()
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let r2 = new Rectangle(-15, -15, -5, -5);
        expect(r1.containsRect(r2)).toBe(false);

        let r3 = new Rectangle(-10, -10, 20, 20);
        let r4 = new Rectangle(-15, -15, 5, 5);
        expect(r3.containsRect(r4)).toBe(false);
    });
});

describe("Rectangle.js copyFrom test", function()
{
    it("copyFrom test", function ()
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

describe("Rectangle.js equals test", function()
{
    it("equals test", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(10, 10, 20, 20);
        expect(r1.equals(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(15, 15, 5, 5);
        expect(r3.equals(r4)).toBe(false);
    });
});

describe("Rectangle.js inflate test", function()
{
    it("inflate test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        let r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflate test2", function ()
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        let r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(-20, -20);
        expect(r2.toString()).toBe("(x=30, y=30, w=-20, h=-20)");
    });

    it("inflate test3", function ()
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        r1.inflate("a", 10);
        expect(r1.toString()).toBe("(x=0, y=-20, w=0, h=0)");

        let r2 = new Rectangle("a", -10, -20, -20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=-20, y=-30, w=20, h=20)");

        let r3 = new Rectangle(-10, "a", -20, -20);
        r3.inflate(20, 20);
        expect(r3.toString()).toBe("(x=-30, y=-20, w=20, h=20)");

        let r4 = new Rectangle(-10, -10, "a", -20);
        r4.inflate(20, 20);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=40, h=20)");
    });
});

describe("Rectangle.js inflatePoint test", function()
{
    it("inflatePoint test1", function ()
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

    it("inflatePoint test2", function ()
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

    it("inflatePoint test3", function ()
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let p1 = new Point("a", 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=-10, y=-20, w=-20, h=0)");

        let r2 = new Rectangle("a", -10, -20, -20);
        let p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-20, y=-30, w=20, h=20)");

        let r3 = new Rectangle(-10, "a", -20, -20);
        let p3 = new Point(20, 20);
        r3.inflatePoint(p3);
        expect(r3.toString()).toBe("(x=-30, y=-20, w=20, h=20)");

        let r4 = new Rectangle(-10, -10, "a", -20);
        let p4 = new Point(20, 20);
        r4.inflatePoint(p4);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=40, h=20)");
    });
});

describe("Rectangle.js intersection test", function()
{
    it("intersection test1", function ()
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

    it("intersection test2", function ()
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

    it("intersection test3", function ()
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

    it("intersection test4", function ()
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

    it("intersection test5", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(15, 15, 5, 5);
        let r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=15, y=15, w=5, h=5)");

        let r4 = new Rectangle(10, 10, "a", 20);
        let r5 = new Rectangle(15, 15, 5, 5);
        let r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        let r7 = new Rectangle(10, 10, 20, 20);
        let r8 = new Rectangle(5, "a", 25, 25);
        let r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=10, y=10, w=20, h=15)");

        let r10 = new Rectangle(10, 10, 20, 20);
        let r11 = new Rectangle(5, 5, 25, "a");
        let r12 = r10.intersection(r11);
        expect(r12.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js intersects test", function()
{
    it("intersects test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 5, 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test2", function ()
    {
        let r1 = new Rectangle(-10, -10, -20, -20);
        let r2 = new Rectangle(-5, -5, -25, -25);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(-10, -10, 20, 20);
        let r4 = new Rectangle(-5, -5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test3", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 5, 25, 25);
        expect(r1.intersects(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, "a", 20);
        let r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test4", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, "a", 25, 25);

        expect(r1.intersects(r2)).toBe(true);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 5, 25, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test5", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, "a", 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 5, 5, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test6", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, "a", -5, 5);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 5, 100, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test7", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test8", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, "a", 20, 20);
        let r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test9", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle("a", 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test10", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(true);

        let r3 = new Rectangle(10, "a", 20, 20);
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test11", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle("a", 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test12", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, "a");
        let r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test13", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 40, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 40, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test14", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, "a");
        let r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test15", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(5, 15, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        let r3 = new Rectangle(10, 10, 20, 20);
        let r4 = new Rectangle(5, 15, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

});

describe("Rectangle.js isEmpty test", function()
{
    it("isEmpty test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);
        expect(r1.isEmpty()).toBe(false);
        expect(r2.isEmpty()).toBe(true);
    });

    it("isEmpty test2", function ()
    {
        let r1 = new Rectangle(10, 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test3", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test4", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test5", function ()
    {
        let r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test6", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test7", function ()
    {
        let r1 = new Rectangle(10, 10, 20, "a");
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test8", function ()
    {
        let r1 = new Rectangle("a", 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test9", function ()
    {
        let r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test10", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test11", function ()
    {
        let r1 = new Rectangle(10, 10, 0, "a");
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test12", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 0);
        expect(r1.isEmpty()).toBe(true);
    });
});

describe("Rectangle.js offset test", function()
{
    it("offset test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset(60, 30);

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset("a", 30);

        expect(r1.toString()).toBe("(x=5, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=0, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset(60, "a");

        expect(r1.toString()).toBe("(x=15, y=18, w=0, h=20)");
        expect(r2.toString()).toBe("(x=5, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js offsetPoint test", function()
{
    it("offsetPoint test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point(60, 30));

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point("a", 30));

        expect(r1.toString()).toBe("(x=5, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=-55, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point(60, "a"));

        expect(r1.toString()).toBe("(x=15, y=18, w=0, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-55, w=0, h=0)");
    });
});

describe("Rectangle.js setEmpty test", function()
{
    it("setEmpty test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setEmpty();
        r2.setEmpty();

        expect(r1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(r2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("setEmpty test2", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setEmpty();
        r2.setEmpty();

        expect(r1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(r2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});

describe("Rectangle.js setTo test", function()
{
    it("setTo test1", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        let r2 = new Rectangle(-55, -55, 0, 0);

        r1.setTo(5, 5, 5, 5);
        r2.setTo(10, 10, 10, 10);

        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
        expect(r2.toString()).toBe("(x=10, y=10, w=10, h=10)");
    });

    it("setTo test2", function ()
    {
        let r1 = new Rectangle("a", 10, 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test3", function ()
    {
        let r1 = new Rectangle(10, "a", 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test4", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test5", function ()
    {
        let r1 = new Rectangle(10, 10, 20, "a");
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test6", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo("a", 5, 5, 5);
        expect(r1.toString()).toBe("(x=0, y=5, w=5, h=5)");
    });

    it("setTo test7", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, "a", 5, 5);
        expect(r1.toString()).toBe("(x=5, y=0, w=5, h=5)");
    });

    it("setTo test8", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, 5, "a", 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=0, h=5)");
    });

    it("setTo test9", function ()
    {
        let r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, 5, 5, "a");
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=0)");
    });
});

describe("Rectangle.js union test", function()
{
    it("union test1", function ()
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

    it("union test2", function ()
    {
        let r1 = new Rectangle(10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test3", function ()
    {
        let r1 = new Rectangle(-10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test4", function ()
    {
        let r1 = new Rectangle(10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test5", function ()
    {
        let r1 = new Rectangle(-10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test6", function ()
    {
        let r1 = new Rectangle(10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test7", function ()
    {
        let r1 = new Rectangle(-10, 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test8", function ()
    {
        let r1 = new Rectangle(10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test9", function ()
    {
        let r1 = new Rectangle(-10, -10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test2", function ()
    {
        let r1 = new Rectangle("a", 10, 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=0, y=10, w=30, h=20)");
    });

    it("union test2", function ()
    {
        let r1 = new Rectangle(10, "a", 10, 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=0, w=20, h=30)");
    });

    it("union test2", function ()
    {
        let r1 = new Rectangle(10, 10, "a", 10);
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=20, y=20, w=10, h=10)");
    });

    it("union test2", function ()
    {
        let r1 = new Rectangle(10, 10, 10, "a");
        let r2 = new Rectangle(20, 20, 10, 10);
        let r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=20, y=20, w=10, h=10)");
    });
});

describe("Rectangle.js bottom test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.bottom).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.bottom = null;
        expect(r.bottom).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.bottom = undefined;
        expect(r.bottom).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.bottom = true;
        expect(r.bottom).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.bottom = "";
        expect(r.bottom).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.bottom = "abc";
        expect(r.bottom).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.bottom = 0;
        expect(r.bottom).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.bottom = 1;
        expect(r.bottom).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.bottom = 500;
        expect(r.bottom).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.bottom = 50000000000000000;
        expect(r.bottom).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.bottom = -1;
        expect(r.bottom).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.bottom = -500;
        expect(r.bottom).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.bottom = -50000000000000000;
        expect(r.bottom).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.bottom = { "a":0 };
        expect(r.bottom).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.bottom = function a() {};
        expect(r.bottom).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.bottom = [1];
        expect(r.bottom).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.bottom = [1,2];
        expect(r.bottom).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.bottom = {};
        expect(r.bottom).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.bottom = { "toString":function () { return 1 } };
        expect(r.bottom).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.bottom = { "toString":function () { return "1" } };
        expect(r.bottom).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.bottom = { "toString":function () { return "1a" } };
        expect(r.bottom).toBe(0);
    });

});

describe("Rectangle.js height test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.height).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.height = null;
        expect(r.height).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.height = undefined;
        expect(r.height).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.height = true;
        expect(r.height).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.height = "";
        expect(r.height).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.height = "abc";
        expect(r.height).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.height = 0;
        expect(r.height).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.height = 1;
        expect(r.height).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.height = 500;
        expect(r.height).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.height = 50000000000000000;
        expect(r.height).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.height = -1;
        expect(r.height).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.height = -500;
        expect(r.height).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.height = -50000000000000000;
        expect(r.height).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.height = { "a":0 };
        expect(r.height).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.height = function a() {};
        expect(r.height).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.height = [1];
        expect(r.height).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.height = [1,2];
        expect(r.height).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.height = {};
        expect(r.height).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.height = { "toString":function () { return 1 } };
        expect(r.height).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.height = { "toString":function () { return "1" } };
        expect(r.height).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.height = { "toString":function () { return "1a" } };
        expect(r.height).toBe(0);
    });

});

describe("Rectangle.js left test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.left).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.left = null;
        expect(r.left).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.left = undefined;
        expect(r.left).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.left = true;
        expect(r.left).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.left = "";
        expect(r.left).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.left = "abc";
        expect(r.left).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.left = 0;
        expect(r.left).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.left = 1;
        expect(r.left).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.left = 500;
        expect(r.left).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.left = 50000000000000000;
        expect(r.left).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.left = -1;
        expect(r.left).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.left = -500;
        expect(r.left).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.left = -50000000000000000;
        expect(r.left).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.left = { "a":0 };
        expect(r.left).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.left = function a() {};
        expect(r.left).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.left = [1];
        expect(r.left).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.left = [1,2];
        expect(r.left).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.left = {};
        expect(r.left).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.left = { "toString":function () { return 1 } };
        expect(r.left).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.left = { "toString":function () { return "1" } };
        expect(r.left).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.left = { "toString":function () { return "1a" } };
        expect(r.left).toBe(0);
    });

});

describe("Rectangle.js right test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.right).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.right = null;
        expect(r.right).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.right = undefined;
        expect(r.right).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.right = true;
        expect(r.right).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.right = "";
        expect(r.right).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.right = "abc";
        expect(r.right).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.right = 0;
        expect(r.right).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.right = 1;
        expect(r.right).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.right = 500;
        expect(r.right).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.right = 50000000000000000;
        expect(r.right).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.right = -1;
        expect(r.right).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.right = -500;
        expect(r.right).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.right = -50000000000000000;
        expect(r.right).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.right = { "a":0 };
        expect(r.right).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.right = function a() {};
        expect(r.right).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.right = [1];
        expect(r.right).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.right = [1,2];
        expect(r.right).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.right = {};
        expect(r.right).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.right = { "toString":function () { return 1 } };
        expect(r.right).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.right = { "toString":function () { return "1" } };
        expect(r.right).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.right = { "toString":function () { return "1a" } };
        expect(r.right).toBe(0);
    });

});

describe("Rectangle.js top test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.top).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.top = null;
        expect(r.top).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.top = undefined;
        expect(r.top).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.top = true;
        expect(r.top).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.top = "";
        expect(r.top).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.top = "abc";
        expect(r.top).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.top = 0;
        expect(r.top).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.top = 1;
        expect(r.top).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.top = 500;
        expect(r.top).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.top = 50000000000000000;
        expect(r.top).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.top = -1;
        expect(r.top).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.top = -500;
        expect(r.top).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.top = -50000000000000000;
        expect(r.top).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.top = { "a":0 };
        expect(r.top).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.top = function a() {};
        expect(r.top).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.top = [1];
        expect(r.top).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.top = [1,2];
        expect(r.top).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.top = {};
        expect(r.top).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.top = { "toString":function () { return 1 } };
        expect(r.top).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.top = { "toString":function () { return "1" } };
        expect(r.top).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.top = { "toString":function () { return "1a" } };
        expect(r.top).toBe(0);
    });

});

describe("Rectangle.js width test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.width).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.width = null;
        expect(r.width).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.width = undefined;
        expect(r.width).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.width = true;
        expect(r.width).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.width = "";
        expect(r.width).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.width = "abc";
        expect(r.width).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.width = 0;
        expect(r.width).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.width = 1;
        expect(r.width).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.width = 500;
        expect(r.width).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.width = 50000000000000000;
        expect(r.width).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.width = -1;
        expect(r.width).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.width = -500;
        expect(r.width).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.width = -50000000000000000;
        expect(r.width).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.width = { "a":0 };
        expect(r.width).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.width = function a() {};
        expect(r.width).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.width = [1];
        expect(r.width).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.width = [1,2];
        expect(r.width).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.width = {};
        expect(r.width).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.width = { "toString":function () { return 1 } };
        expect(r.width).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.width = { "toString":function () { return "1" } };
        expect(r.width).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.width = { "toString":function () { return "1a" } };
        expect(r.width).toBe(0);
    });

});

describe("Rectangle.js x test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.x).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.x = null;
        expect(r.x).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.x = undefined;
        expect(r.x).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.x = true;
        expect(r.x).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.x = "";
        expect(r.x).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.x = "abc";
        expect(r.x).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.x = 0;
        expect(r.x).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.x = 1;
        expect(r.x).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.x = 500;
        expect(r.x).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.x = 50000000000000000;
        expect(r.x).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.x = -1;
        expect(r.x).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.x = -500;
        expect(r.x).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.x = -50000000000000000;
        expect(r.x).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.x = { "a":0 };
        expect(r.x).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.x = function a() {};
        expect(r.x).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.x = [1];
        expect(r.x).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.x = [1,2];
        expect(r.x).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.x = {};
        expect(r.x).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.x = { "toString":function () { return 1 } };
        expect(r.x).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.x = { "toString":function () { return "1" } };
        expect(r.x).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.x = { "toString":function () { return "1a" } };
        expect(r.x).toBe(0);
    });

});

describe("Rectangle.js y test", function()
{

    it("default test case1", function()
    {
        let r = new Rectangle();
        expect(r.y).toBe(0);
    });

    it("default test case2", function()
    {
        let r = new Rectangle();
        r.y = null;
        expect(r.y).toBe(0);
    });

    it("default test case3", function()
    {
        let r = new Rectangle();
        r.y = undefined;
        expect(r.y).toBe(0);
    });

    it("default test case4", function()
    {
        let r = new Rectangle();
        r.y = true;
        expect(r.y).toBe(1);
    });

    it("default test case5", function()
    {
        let r = new Rectangle();
        r.y = "";
        expect(r.y).toBe(0);
    });

    it("default test case6", function()
    {
        let r = new Rectangle();
        r.y = "abc";
        expect(r.y).toBe(0);
    });

    it("default test case7", function()
    {
        let r = new Rectangle();
        r.y = 0;
        expect(r.y).toBe(0);
    });

    it("default test case8", function()
    {
        let r = new Rectangle();
        r.y = 1;
        expect(r.y).toBe(1);
    });

    it("default test case9", function()
    {
        let r = new Rectangle();
        r.y = 500;
        expect(r.y).toBe(500);
    });

    it("default test case10", function()
    {
        let r = new Rectangle();
        r.y = 50000000000000000;
        expect(r.y).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let r = new Rectangle();
        r.y = -1;
        expect(r.y).toBe(-1);
    });

    it("default test case12", function()
    {
        let r = new Rectangle();
        r.y = -500;
        expect(r.y).toBe(-500);
    });

    it("default test case13", function()
    {
        let r = new Rectangle();
        r.y = -50000000000000000;
        expect(r.y).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let r = new Rectangle();
        r.y = { "a":0 };
        expect(r.y).toBe(0);
    });

    it("default test case15", function()
    {
        let r = new Rectangle();
        r.y = function a() {};
        expect(r.y).toBe(0);
    });

    it("default test case16", function()
    {
        let r = new Rectangle();
        r.y = [1];
        expect(r.y).toBe(1);
    });

    it("default test case17", function()
    {
        let r = new Rectangle();
        r.y = [1,2];
        expect(r.y).toBe(0);
    });

    it("default test case18", function()
    {
        let r = new Rectangle();
        r.y = {};
        expect(r.y).toBe(0);
    });

    it("default test case19", function()
    {
        let r = new Rectangle();
        r.y = { "toString":function () { return 1 } };
        expect(r.y).toBe(1);
    });

    it("default test case20", function()
    {
        let r = new Rectangle();
        r.y = { "toString":function () { return "1" } };
        expect(r.y).toBe(1);
    });

    it("default test case21", function()
    {
        let r = new Rectangle();
        r.y = { "toString":function () { return "1a" } };
        expect(r.y).toBe(0);
    });

});