
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


describe("Rectangle.js getQualifiedClassName test", function()
{

    it("namespace test public", function()
    {
        const object = new Rectangle();
        expect(object.namespace).toBe("next2d.geom:Rectangle");
    });

    it("namespace test static", function()
    {
        expect(Rectangle.namespace).toBe("next2d.geom:Rectangle");
    });

});


describe("Rectangle.js property test", function()
{
    it("top test1", function ()
    {

        var r = new Rectangle(50, 50, 100, 100);
        expect(r.top).toBe(50);
        expect(r.bottom).toBe(150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=50, y=160, w=100, h=-10)");
        expect(r.bottom).toBe(150);
        expect(r.y).toBe(160);

        // error
        r.top = "a";
        expect(r.y+"").toBe("NaN");
        expect(r.height+"").toBe("NaN");
    });

    it("top test2", function ()
    {

        var r = new Rectangle(-50, -50, -100, -100);
        expect(r.top).toBe(-50);
        expect(r.bottom).toBe(-150);

        // success
        r.top = 160;
        expect(r.toString()).toBe("(x=-50, y=160, w=-100, h=-310)");
        expect(r.bottom).toBe(-150);
        expect(r.y).toBe(160);

        // error
        r.top = "a";
        expect(r.y+"").toBe("NaN");
        expect(r.height+"").toBe("NaN");
    });


    it("right test1", function ()
    {

        var r = new Rectangle(50, 100, 100, 100);
        expect(r.right).toBe(150);

        // success
        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=100, w=-30, h=100)");

        // error
        r.right = "a";
        expect(r.right+"").toBe("NaN");
    });


    it("right test2", function ()
    {

        var r = new Rectangle(50, -100, -100, -100);
        expect(r.right).toBe(-50);

        // success

        r.right = 20;
        expect(r.toString()).toBe("(x=50, y=-100, w=-30, h=-100)");

        // error
        r.right = "a";
        expect(r.right+"").toBe("NaN");
    });


    it("bottom test1", function ()
    {

        var r = new Rectangle(0, 100, 100, 100);
        expect(r.bottom).toBe(200);

        // success
        r.bottom = 50;
        expect(r.toString()).toBe("(x=0, y=100, w=100, h=-50)");

        // error
        r.bottom = "a";
        expect(r.height+"").toBe("NaN");
    });


    it("bottom test2", function ()
    {

        var r = new Rectangle(0, -100, -100, -100);
        expect(r.bottom).toBe(-200);

        // success
        r.bottom = -50;
        expect(r.toString()).toBe("(x=0, y=-100, w=-100, h=50)");

        // error
        r.bottom = "a";
        expect(r.height+"").toBe("NaN");
    });


    it("left test1", function ()
    {

        var r = new Rectangle(50, 50, 100, 100);
        expect(r.left).toBe(50);
        expect(r.right).toBe(150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=50, w=-10, h=100)");
        expect(r.right).toBe(150);
        expect(r.x).toBe(160);

        // error
        r.left = "a";
        expect(r.x+"").toBe("NaN");
        expect(r.width+"").toBe("NaN");
    });


    it("left test2", function ()
    {

        var r = new Rectangle(-50, -50, -100, -100);
        expect(r.left).toBe(-50);
        expect(r.right).toBe(-150);

        // success
        r.left = 160;
        expect(r.toString()).toBe("(x=160, y=-50, w=-310, h=-100)");
        expect(r.right).toBe(-150);
        expect(r.x).toBe(160);

        // error
        r.left = "a";
        expect(r.x+"").toBe("NaN");
        expect(r.width+"").toBe("NaN");
    });


    it("bottomRight test1", function ()
    {

        var r = new Rectangle(30, 50, 80, 100);
        var p = r.bottomRight;
        expect(p.toString()).toBe("(x=110, y=150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=-20, h=-40)");
    });


    it("bottomRight test2", function ()
    {

        var r = new Rectangle(-30, -50, -80, -100);
        var p = r.bottomRight;
        expect(p.toString()).toBe("(x=-110, y=-150)");

        r.bottomRight = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=40, h=60)");
    });


    it("topLeft test1", function ()
    {

        var r = new Rectangle(30, 50, 80, 100);
        var p = r.topLeft;
        expect(p.toString()).toBe("(x=30, y=50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=100, h=140)");
    });


    it("topLeft test2", function ()
    {

        var r = new Rectangle(-30, -50, -80, -100);
        var p = r.topLeft;
        expect(p.toString()).toBe("(x=-30, y=-50)");

        r.topLeft = new Point(10 ,10);
        expect(r.toString()).toBe("(x=10, y=10, w=-120, h=-160)");
    });


    it("size test1", function ()
    {

        var r = new Rectangle(30, 50, 80, 100);
        var p = r.size;
        expect(p.toString()).toBe("(x=80, y=100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=30, y=50, w=10, h=10)");
    });


    it("size test2", function ()
    {

        var r = new Rectangle(-30, -50, -80, -100);
        var p = r.size;
        expect(p.toString()).toBe("(x=-80, y=-100)");

        r.size = new Point(10 ,10);
        expect(r.toString()).toBe("(x=-30, y=-50, w=10, h=10)");
    });
});


describe("Rectangle.js clone test", function()
{
    it("clone test", function ()
    {
        var r1 = new Rectangle(30, 50, 80, 100);
        var r2 = r1.clone();
        r2.x   = 100;

        expect(r1.toString()).toBe("(x=30, y=50, w=80, h=100)");
        expect(r2.toString()).toBe("(x=100, y=50, w=80, h=100)");
    });
});


describe("Rectangle.js contains test", function()
{

    it("contains test1", function ()
    {
        var r = new Rectangle(30, 50, 80, 100);
        expect(r.contains(30, 50)).toBe(true);
        expect(r.contains(110, 150)).toBe(false);
        expect(r.contains(109, 149)).toBe(true);
        expect(r.contains(20, 40)).toBe(false);
    });

    it("contains test2", function ()
    {
        var r = new Rectangle(0, 0, 0, 0);
        expect(r.contains(0, 0)).toBe(false);
        expect(r.contains("a", 0)).toBe(false);
        expect(r.contains(0, "a")).toBe(false);
    });

    it("contains test3", function ()
    {
        var r = new Rectangle(0, 0, 1, 1);
        expect(r.contains(0, 0)).toBe(true);
        expect(r.contains(0.000001, 0.000001)).toBe(true);
        expect(r.contains(0.999999, 0.999999)).toBe(true);
        expect(r.contains(1, 0)).toBe(false);
        expect(r.contains(0, 1)).toBe(false);
        expect(r.contains(1, 1)).toBe(false);
    });

    it("contains test4", function ()
    {
        var r = new Rectangle(-1, -1, 1, 1);
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
        var r = new Rectangle(30, 50, 80, 100);

        var p1 = new Point(30, 50);
        expect(r.containsPoint(p1)).toBe(true);

        var p2 = new Point(110, 150);
        expect(r.containsPoint(p2)).toBe(false);

        var p3 = new Point(109, 149);
        expect(r.containsPoint(p3)).toBe(true);

        var p4 = new Point(20, 40);
        expect(r.containsPoint(p4)).toBe(false);
    });

    it("containsPoint test2", function ()
    {
        var r = new Rectangle(-30, -50, -80, -100);

        var p1 = new Point(-30, -50);
        expect(r.containsPoint(p1)).toBe(false);

        var p2 = new Point(-110, -150);
        expect(r.containsPoint(p2)).toBe(false);

        var p3 = new Point(-109, -149);
        expect(r.containsPoint(p3)).toBe(false);

        var p5 = new Point(110, 150);
        expect(r.containsPoint(p5)).toBe(false);

        var p6 = new Point(109, 149);
        expect(r.containsPoint(p6)).toBe(false);

        var p4 = new Point(-20, -40);
        expect(r.containsPoint(p4)).toBe(false);
    });
});


describe("Rectangle.js containsRect test", function()
{
    it("containsRect test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(15, 15, 5, 5);
        expect(r1.containsRect(r2)).toBe(true);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(10, 10, 20, 20);
        expect(r3.containsRect(r4)).toBe(true);

        var r5 = new Rectangle(10, 10, 20, 20);
        var r6 = new Rectangle(9, 9, 20, 20);
        expect(r5.containsRect(r6)).toBe(false);

        var r7 = new Rectangle(10, 10, 20, 20);
        var r8 = new Rectangle(15, 15, 20, 20);
        expect(r7.containsRect(r8)).toBe(false);
    });

    it("containsRect test2", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        var r2 = new Rectangle(-15, -15, -5, -5);
        expect(r1.containsRect(r2)).toBe(false);

        var r3 = new Rectangle(-10, -10, 20, 20);
        var r4 = new Rectangle(-15, -15, 5, 5);
        expect(r3.containsRect(r4)).toBe(false);
    });
});


describe("Rectangle.js copyFrom test", function()
{
    it("copyFrom test", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(15, 15, 5, 5);

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
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(10, 10, 20, 20);
        expect(r1.equals(r2)).toBe(true);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(15, 15, 5, 5);
        expect(r3.equals(r4)).toBe(false);
    });
});


describe("Rectangle.js inflate test", function()
{
    it("inflate test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        var r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflate test2", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        r1.inflate(10, 10);
        expect(r1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        var r2 = new Rectangle(10, 10, 20, 20);
        r2.inflate(-20, -20);
        expect(r2.toString()).toBe("(x=30, y=30, w=-20, h=-20)");
    });

    it("inflate test3", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        r1.inflate("a", 10);
        expect(r1.toString()).toBe("(x=NaN, y=-20, w=NaN, h=0)");

        var r2 = new Rectangle("a", -10, -20, -20);
        r2.inflate(20, 20);
        expect(r2.toString()).toBe("(x=NaN, y=-30, w=20, h=20)");

        var r3 = new Rectangle(-10, "a", -20, -20);
        r3.inflate(20, 20);
        expect(r3.toString()).toBe("(x=-30, y=NaN, w=20, h=20)");

        var r4 = new Rectangle(-10, -10, "a", -20);
        r4.inflate(20, 20);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=NaN, h=20)");
    });
});


describe("Rectangle.js inflatePoint test", function()
{
    it("inflatePoint test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var p1 = new Point(10, 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=0, y=0, w=40, h=40)");

        var r2 = new Rectangle(10, 10, 20, 20);
        var p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-10, y=-10, w=60, h=60)");
    });

    it("inflatePoint test2", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        var p1 = new Point(10, 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=-20, y=-20, w=0, h=0)");

        var r2 = new Rectangle(-10, -10, 20, 20);
        var p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=-30, y=-30, w=60, h=60)");
    });

    it("inflatePoint test3", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        var p1 = new Point("a", 10);
        r1.inflatePoint(p1);
        expect(r1.toString()).toBe("(x=NaN, y=-20, w=NaN, h=0)");

        var r2 = new Rectangle("a", -10, -20, -20);
        var p2 = new Point(20, 20);
        r2.inflatePoint(p2);
        expect(r2.toString()).toBe("(x=NaN, y=-30, w=20, h=20)");

        var r3 = new Rectangle(-10, "a", -20, -20);
        var p3 = new Point(20, 20);
        r3.inflatePoint(p3);
        expect(r3.toString()).toBe("(x=-30, y=NaN, w=20, h=20)");

        var r4 = new Rectangle(-10, -10, "a", -20);
        var p4 = new Point(20, 20);
        r4.inflatePoint(p4);
        expect(r4.toString()).toBe("(x=-30, y=-30, w=NaN, h=20)");
    });
});


describe("Rectangle.js intersection test", function()
{
    it("intersection test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, 5, 5, 5);
        var r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r4 = new Rectangle(10, 10, 20, 20);
        var r5 = new Rectangle(15, 15, 5, 5);
        var r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=15, y=15, w=5, h=5)");

        var r7 = new Rectangle(10, 10, 20, 20);
        var r8 = new Rectangle(5, 5, 25, 25);
        var r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("intersection test2", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        var r2 = new Rectangle(-5, -5, -5, -5);
        var r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r4 = new Rectangle(-10, -10, -20, -20);
        var r5 = new Rectangle(-15, -15, -5, -5);
        var r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r7 = new Rectangle(-10, -10, -20, -20);
        var r8 = new Rectangle(-5, -5, -25, -25);
        var r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("intersection test3", function ()
    {
        var r1 = new Rectangle(-10, -10, 20, 20);
        var r2 = new Rectangle(-5, -5, 5, 5);
        var r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=-5, y=-5, w=5, h=5)");

        var r4 = new Rectangle(-10, -10, 20, 20);
        var r5 = new Rectangle(-15, -15, 5, 5);
        var r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r7 = new Rectangle(-10, -10, 20, 20);
        var r8 = new Rectangle(-5, -5, 25, 25);
        var r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=-5, y=-5, w=15, h=15)");
    });

    it("intersection test4", function ()
    {
        var r1 = new Rectangle(-10, -10, 20, 20);
        var r2 = new Rectangle(-10, -10, 0, 10);
        var r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r4 = new Rectangle(-10, -10, 20, 20);
        var r5 = new Rectangle(-10, -10, 5, 5);
        var r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=-10, y=-10, w=5, h=5)");

        var r7 = new Rectangle(-5, -5, -25, -25);
        var r8 = new Rectangle(-10, -10, -20, -20);
        var r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("intersection test5", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(15, 15, 5, 5);
        var r3 = r1.intersection(r2);
        expect(r3.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r4 = new Rectangle(10, 10, "a", 20);
        var r5 = new Rectangle(15, 15, 5, 5);
        var r6 = r4.intersection(r5);
        expect(r6.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r7 = new Rectangle(10, 10, 20, 20);
        var r8 = new Rectangle(5, "a", 25, 25);
        var r9 = r7.intersection(r8);
        expect(r9.toString()).toBe("(x=0, y=0, w=0, h=0)");

        var r10 = new Rectangle(10, 10, 20, 20);
        var r11 = new Rectangle(5, 5, 25, "a");
        var r12 = r10.intersection(r11);
        expect(r12.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });
});


describe("Rectangle.js intersects test", function()
{
    it("intersects test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, 5, 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test2", function ()
    {
        var r1 = new Rectangle(-10, -10, -20, -20);
        var r2 = new Rectangle(-5, -5, -25, -25);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(-10, -10, 20, 20);
        var r4 = new Rectangle(-5, -5, 25, 25);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test3", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(5, 5, 25, 25);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, "a", 20);
        var r4 = new Rectangle(5, 5, 25, 25);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test4", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, "a", 25, 25);

        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 5, 25, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test5", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, "a", 5, 5);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 5, 5, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test6", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, "a", -5, 5);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 5, 100, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test7", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(true);
    });

    it("intersects test8", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, "a", 20, 20);
        var r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test9", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle("a", 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test10", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, "a", 20, 20);
        var r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test11", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle("a", 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, "a", 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test12", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        var r2 = new Rectangle(5, 40, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, "a");
        var r4 = new Rectangle(5, 40, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test13", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, 40, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 40, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test14", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        var r2 = new Rectangle(5, 15, 10, 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, "a");
        var r4 = new Rectangle(5, 15, 10, 10);
        expect(r3.intersects(r4)).toBe(false);
    });

    it("intersects test15", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(5, 15, "a", 10);
        expect(r1.intersects(r2)).toBe(false);

        var r3 = new Rectangle(10, 10, 20, 20);
        var r4 = new Rectangle(5, 15, 10, "a");
        expect(r3.intersects(r4)).toBe(false);
    });

});


describe("Rectangle.js isEmpty test", function()
{
    it("isEmpty test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);
        expect(r1.isEmpty()).toBe(false);
        expect(r2.isEmpty()).toBe(true);
    });

    it("isEmpty test2", function ()
    {
        var r1 = new Rectangle(10, 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test3", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test4", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 0);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test5", function ()
    {
        var r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test6", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(false);
    });

    it("isEmpty test7", function ()
    {
        var r1 = new Rectangle(10, 10, 20, "a");
        expect(r1.isEmpty()).toBe(false);
    });

    it("isEmpty test8", function ()
    {
        var r1 = new Rectangle("a", 10, 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test9", function ()
    {
        var r1 = new Rectangle(10, "a", 0, 20);
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test10", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        expect(r1.isEmpty()).toBe(false);
    });

    it("isEmpty test11", function ()
    {
        var r1 = new Rectangle(10, 10, 0, "a");
        expect(r1.isEmpty()).toBe(true);
    });

    it("isEmpty test12", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 0);
        expect(r1.isEmpty()).toBe(true);
    });
});


describe("Rectangle.js offset test", function()
{
    it("offset test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset(60, 30);

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset("a", 30);

        expect(r1.toString()).toBe("(x=NaN, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=NaN, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offset(5, 8);
        r2.offset(60, "a");

        expect(r1.toString()).toBe("(x=15, y=18, w=NaN, h=20)");
        expect(r2.toString()).toBe("(x=5, y=NaN, w=0, h=0)");
    });
});


describe("Rectangle.js offsetPoint test", function()
{
    it("offsetPoint test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point(60, 30));

        expect(r1.toString()).toBe("(x=15, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=5, y=-25, w=0, h=0)");
    });

    it("offsetPoint test2", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point("a", 30));

        expect(r1.toString()).toBe("(x=NaN, y=18, w=20, h=20)");
        expect(r2.toString()).toBe("(x=NaN, y=-25, w=0, h=0)");
    });

    it("offsetPoint test3", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.offsetPoint(new Point(5, 8));
        r2.offsetPoint(new Point(60, "a"));

        expect(r1.toString()).toBe("(x=15, y=18, w=NaN, h=20)");
        expect(r2.toString()).toBe("(x=5, y=NaN, w=0, h=0)");
    });
});

describe("Rectangle.js setEmpty test", function()
{
    it("setEmpty test1", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.setEmpty();
        r2.setEmpty();

        expect(r1.toString()).toBe("(x=0, y=0, w=0, h=0)");
        expect(r2.toString()).toBe("(x=0, y=0, w=0, h=0)");
    });

    it("setEmpty test2", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

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
        var r1 = new Rectangle(10, 10, 20, 20);
        var r2 = new Rectangle(-55, -55, 0, 0);

        r1.setTo(5, 5, 5, 5);
        r2.setTo(10, 10, 10, 10);

        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
        expect(r2.toString()).toBe("(x=10, y=10, w=10, h=10)");
    });

    it("setTo test2", function ()
    {
        var r1 = new Rectangle("a", 10, 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test3", function ()
    {
        var r1 = new Rectangle(10, "a", 20, 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test4", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 20);
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test5", function ()
    {
        var r1 = new Rectangle(10, 10, 20, "a");
        r1.setTo(5, 5, 5, 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=5)");
    });

    it("setTo test6", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo("a", 5, 5, 5);
        expect(r1.toString()).toBe("(x=NaN, y=5, w=5, h=5)");
    });

    it("setTo test7", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, "a", 5, 5);
        expect(r1.toString()).toBe("(x=5, y=NaN, w=5, h=5)");
    });

    it("setTo test8", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, 5, "a", 5);
        expect(r1.toString()).toBe("(x=5, y=5, w=NaN, h=5)");
    });

    it("setTo test9", function ()
    {
        var r1 = new Rectangle(10, 10, 20, 20);
        r1.setTo(5, 5, 5, "a");
        expect(r1.toString()).toBe("(x=5, y=5, w=5, h=NaN)");
    });
});


describe("Rectangle.js union test", function()
{
    it("union test1", function ()
    {
        var r1 = new Rectangle(10, 10, 0, 10);
        var r2 = new Rectangle(-55, -25, 0, 20);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-55, y=-25, w=0, h=20)");

        var r4 = new Rectangle(10, 10, 10, 10);
        var r5 = new Rectangle(-55, -25, 0, 20);
        var r6 = r4.union(r5);
        expect(r6.toString()).toBe("(x=10, y=10, w=10, h=10)");

        var r7 = new Rectangle(10, 10, 10, 10);
        var r8 = new Rectangle(-55, -25, 20, 20);
        var r9 = r7.union(r8);
        expect(r9.toString()).toBe("(x=-55, y=-25, w=75, h=45)");
    });

    it("union test2", function ()
    {
        var r1 = new Rectangle(10, 10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test3", function ()
    {
        var r1 = new Rectangle(-10, 10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test4", function ()
    {
        var r1 = new Rectangle(10, -10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test5", function ()
    {
        var r1 = new Rectangle(-10, -10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test6", function ()
    {
        var r1 = new Rectangle(10, 10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=20)");
    });

    it("union test7", function ()
    {
        var r1 = new Rectangle(-10, 10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=10, w=40, h=20)");
    });

    it("union test8", function ()
    {
        var r1 = new Rectangle(10, -10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=10, y=-10, w=20, h=40)");
    });

    it("union test9", function ()
    {
        var r1 = new Rectangle(-10, -10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r2.union(r1);
        expect(r3.toString()).toBe("(x=-10, y=-10, w=40, h=40)");
    });

    it("union test2", function ()
    {
        var r1 = new Rectangle("a", 10, 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=NaN, y=10, w=NaN, h=20)");
    });

    it("union test2", function ()
    {
        var r1 = new Rectangle(10, "a", 10, 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=NaN, w=20, h=NaN)");
    });

    it("union test2", function ()
    {
        var r1 = new Rectangle(10, 10, "a", 10);
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=10, w=NaN, h=20)");
    });

    it("union test2", function ()
    {
        var r1 = new Rectangle(10, 10, 10, "a");
        var r2 = new Rectangle(20, 20, 10, 10);
        var r3 = r1.union(r2);
        expect(r3.toString()).toBe("(x=10, y=10, w=20, h=NaN)");
    });
});

describe("Rectangle.js bottom test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.bottom).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.bottom = null;
        expect(r.bottom).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.bottom = undefined;
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.bottom = true;
        expect(r.bottom).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.bottom = "";
        expect(r.bottom).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.bottom = "abc";
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.bottom = 0;
        expect(r.bottom).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.bottom = 1;
        expect(r.bottom).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.bottom = 500;
        expect(r.bottom).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.bottom = 50000000000000000;
        expect(r.bottom).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.bottom = -1;
        expect(r.bottom).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.bottom = -500;
        expect(r.bottom).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.bottom = -50000000000000000;
        expect(r.bottom).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.bottom = {a:0};
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.bottom = function a(){};
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.bottom = [1];
        expect(r.bottom).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.bottom = [1,2];
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.bottom = {};
        expect(isNaN(r.bottom)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.bottom = {toString:function () { return 1; } };
        expect(r.bottom).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.bottom = {toString:function () { return "1"; } };
        expect(r.bottom).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.bottom = {toString:function () { return "1a"; } };
        expect(isNaN(r.bottom)).toBe(true);
    });

});

describe("Rectangle.js height test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.height).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.height = null;
        expect(r.height).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.height = undefined;
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.height = true;
        expect(r.height).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.height = "";
        expect(r.height).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.height = "abc";
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.height = 0;
        expect(r.height).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.height = 1;
        expect(r.height).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.height = 500;
        expect(r.height).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.height = 50000000000000000;
        expect(r.height).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.height = -1;
        expect(r.height).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.height = -500;
        expect(r.height).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.height = -50000000000000000;
        expect(r.height).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.height = {a:0};
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.height = function a(){};
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.height = [1];
        expect(r.height).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.height = [1,2];
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.height = {};
        expect(isNaN(r.height)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.height = {toString:function () { return 1; } };
        expect(r.height).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.height = {toString:function () { return "1"; } };
        expect(r.height).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.height = {toString:function () { return "1a"; } };
        expect(isNaN(r.height)).toBe(true);
    });

});

describe("Rectangle.js left test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.left).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.left = null;
        expect(r.left).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.left = undefined;
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.left = true;
        expect(r.left).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.left = "";
        expect(r.left).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.left = "abc";
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.left = 0;
        expect(r.left).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.left = 1;
        expect(r.left).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.left = 500;
        expect(r.left).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.left = 50000000000000000;
        expect(r.left).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.left = -1;
        expect(r.left).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.left = -500;
        expect(r.left).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.left = -50000000000000000;
        expect(r.left).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.left = {a:0};
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.left = function a(){};
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.left = [1];
        expect(r.left).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.left = [1,2];
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.left = {};
        expect(isNaN(r.left)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.left = {toString:function () { return 1; } };
        expect(r.left).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.left = {toString:function () { return "1"; } };
        expect(r.left).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.left = {toString:function () { return "1a"; } };
        expect(isNaN(r.left)).toBe(true);
    });

});

describe("Rectangle.js right test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.right).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.right = null;
        expect(r.right).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.right = undefined;
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.right = true;
        expect(r.right).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.right = "";
        expect(r.right).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.right = "abc";
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.right = 0;
        expect(r.right).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.right = 1;
        expect(r.right).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.right = 500;
        expect(r.right).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.right = 50000000000000000;
        expect(r.right).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.right = -1;
        expect(r.right).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.right = -500;
        expect(r.right).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.right = -50000000000000000;
        expect(r.right).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.right = {a:0};
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.right = function a(){};
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.right = [1];
        expect(r.right).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.right = [1,2];
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.right = {};
        expect(isNaN(r.right)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.right = {toString:function () { return 1; } };
        expect(r.right).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.right = {toString:function () { return "1"; } };
        expect(r.right).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.right = {toString:function () { return "1a"; } };
        expect(isNaN(r.right)).toBe(true);
    });

});

describe("Rectangle.js top test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.top).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.top = null;
        expect(r.top).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.top = undefined;
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.top = true;
        expect(r.top).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.top = "";
        expect(r.top).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.top = "abc";
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.top = 0;
        expect(r.top).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.top = 1;
        expect(r.top).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.top = 500;
        expect(r.top).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.top = 50000000000000000;
        expect(r.top).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.top = -1;
        expect(r.top).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.top = -500;
        expect(r.top).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.top = -50000000000000000;
        expect(r.top).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.top = {a:0};
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.top = function a(){};
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.top = [1];
        expect(r.top).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.top = [1,2];
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.top = {};
        expect(isNaN(r.top)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.top = {toString:function () { return 1; } };
        expect(r.top).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.top = {toString:function () { return "1"; } };
        expect(r.top).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.top = {toString:function () { return "1a"; } };
        expect(isNaN(r.top)).toBe(true);
    });

});

describe("Rectangle.js width test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.width).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.width = null;
        expect(r.width).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.width = undefined;
        expect(isNaN(r.width)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.width = true;
        expect(r.width).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.width = "";
        expect(r.width).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.width = "abc";
        expect(isNaN(r.width0)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.width = 0;
        expect(r.width).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.width = 1;
        expect(r.width).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.width = 500;
        expect(r.width).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.width = 50000000000000000;
        expect(r.width).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.width = -1;
        expect(r.width).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.width = -500;
        expect(r.width).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.width = -50000000000000000;
        expect(r.width).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.width = {a:0};
        expect(isNaN(r.width)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.width = function a(){};
        expect(isNaN(r.width)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.width = [1];
        expect(r.width).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.width = [1,2];
        expect(isNaN(r.width)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.width = {};
        expect(isNaN(r.width)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.width = {toString:function () { return 1; } };
        expect(r.width).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.width = {toString:function () { return "1"; } };
        expect(r.width).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.width = {toString:function () { return "1a"; } };
        expect(isNaN(r.width)).toBe(true);
    });

});

describe("Rectangle.js x test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.x).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.x = null;
        expect(r.x).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.x = undefined;
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.x = true;
        expect(r.x).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.x = "";
        expect(r.x).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.x = "abc";
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.x = 0;
        expect(r.x).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.x = 1;
        expect(r.x).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.x = 500;
        expect(r.x).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.x = 50000000000000000;
        expect(r.x).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.x = -1;
        expect(r.x).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.x = -500;
        expect(r.x).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.x = -50000000000000000;
        expect(r.x).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.x = {a:0};
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.x = function a(){};
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.x = [1];
        expect(r.x).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.x = [1,2];
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.x = {};
        expect(isNaN(r.x)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.x = {toString:function () { return 1; } };
        expect(r.x).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.x = {toString:function () { return "1"; } };
        expect(r.x).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.x = {toString:function () { return "1a"; } };
        expect(isNaN(r.x)).toBe(true);
    });

});

describe("Rectangle.js y test", function()
{

    it("default test case1", function()
    {
        var r = new Rectangle();
        expect(r.y).toBe(0);
    });

    it("default test case2", function()
    {
        var r = new Rectangle();
        r.y = null;
        expect(r.y).toBe(0);
    });

    it("default test case3", function()
    {
        var r = new Rectangle();
        r.y = undefined;
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case4", function()
    {
        var r = new Rectangle();
        r.y = true;
        expect(r.y).toBe(1);
    });

    it("default test case5", function()
    {
        var r = new Rectangle();
        r.y = "";
        expect(r.y).toBe(0);
    });

    it("default test case6", function()
    {
        var r = new Rectangle();
        r.y = "abc";
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case7", function()
    {
        var r = new Rectangle();
        r.y = 0;
        expect(r.y).toBe(0);
    });

    it("default test case8", function()
    {
        var r = new Rectangle();
        r.y = 1;
        expect(r.y).toBe(1);
    });

    it("default test case9", function()
    {
        var r = new Rectangle();
        r.y = 500;
        expect(r.y).toBe(500);
    });

    it("default test case10", function()
    {
        var r = new Rectangle();
        r.y = 50000000000000000;
        expect(r.y).toBe(50000000000000000);
    });

    it("default test case11", function()
    {
        var r = new Rectangle();
        r.y = -1;
        expect(r.y).toBe(-1);
    });

    it("default test case12", function()
    {
        var r = new Rectangle();
        r.y = -500;
        expect(r.y).toBe(-500);
    });

    it("default test case13", function()
    {
        var r = new Rectangle();
        r.y = -50000000000000000;
        expect(r.y).toBe(-50000000000000000);
    });

    it("default test case14", function()
    {
        var r = new Rectangle();
        r.y = {a:0};
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case15", function()
    {
        var r = new Rectangle();
        r.y = function a(){};
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case16", function()
    {
        var r = new Rectangle();
        r.y = [1];
        expect(r.y).toBe(1);
    });

    it("default test case17", function()
    {
        var r = new Rectangle();
        r.y = [1,2];
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case18", function()
    {
        var r = new Rectangle();
        r.y = {};
        expect(isNaN(r.y)).toBe(true);
    });

    it("default test case19", function()
    {
        var r = new Rectangle();
        r.y = {toString:function () { return 1; } };
        expect(r.y).toBe(1);
    });

    it("default test case20", function()
    {
        var r = new Rectangle();
        r.y = {toString:function () { return "1"; } };
        expect(r.y).toBe(1);
    });

    it("default test case21", function()
    {
        var r = new Rectangle();
        r.y = {toString:function () { return "1a"; } };
        expect(isNaN(r.y)).toBe(true);
    });

});