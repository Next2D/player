
describe("Point.js toString test", function()
{
    it("toString test1 success", function()
    {
        const object = new Point();
        expect(object.toString()).toBe("(x=0, y=0)");
    });

    it("toString test2 success", function()
    {
        const object = new Point(1, 2);
        expect(object.toString()).toBe("(x=1, y=2)");
    });
});

describe("Point.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(Point.toString()).toBe("[class Point]");
    });

});

describe("Point.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new Point();
        expect(object.namespace).toBe("next2d.geom.Point");
    });

    it("namespace test static", function()
    {
        expect(Point.namespace).toBe("next2d.geom.Point");
    });

});

describe("Point.js property valid test and clone test", function()
{

    it("valid and clone test", function () {

        // valid
        let p1 = new Point("a", "b");
        p1.x = "a";
        p1.y = "b";

        // clone
        let p2 = p1.clone();
        p2.x = 10;
        p2.y = 20;

        // origin
        expect(p1.x).toBe(0);
        expect(p1.y).toBe(0);

        // clone
        expect(p2.x).toBe(10);
        expect(p2.y).toBe(20);
        expect(p2.length).toBe(22.360679774997898);
        expect(p2.toString()).toBe("(x=10, y=20)");
    });

});

describe("Point.js add test", function()
{

    it("add test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, 20);

        let p3 = p1.add(p1);
        let p4 = p2.add(p2);
        let p5 = p1.add(p2);
        let p6 = p2.add(p1);

        expect(p3.toString()).toBe("(x=20, y=20)");
        expect(p4.toString()).toBe("(x=40, y=40)");
        expect(p5.toString()).toBe("(x=30, y=30)");
        expect(p6.toString()).toBe("(x=30, y=30)");
    });

    it("add test2", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, -20);

        let p3 = p1.add(p1);
        let p4 = p2.add(p2);
        let p5 = p1.add(p2);
        let p6 = p2.add(p1);

        expect(p3.toString()).toBe("(x=-20, y=-20)");
        expect(p4.toString()).toBe("(x=40, y=-40)");
        expect(p5.toString()).toBe("(x=10, y=-30)");
        expect(p6.toString()).toBe("(x=10, y=-30)");
    });

    it("add test3", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point(20, 0);

        let p3 = p1.add(p1);
        let p4 = p2.add(p2);
        let p5 = p1.add(p2);
        let p6 = p2.add(p1);

        expect(p3.toString()).toBe("(x=0, y=20)");
        expect(p4.toString()).toBe("(x=40, y=0)");
        expect(p5.toString()).toBe("(x=20, y=10)");
        expect(p6.toString()).toBe("(x=20, y=10)");
    });

});

describe("Point.js copyFrom test", function()
{

    it("copyFrom test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, 20);

        p1.copyFrom(p2);
        p1.x = 10;

        expect(p1.toString()).toBe("(x=10, y=20)");
        expect(p2.toString()).toBe("(x=20, y=20)");
    });

    it("copyFrom test2", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, -20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=-20)");
        expect(p2.toString()).toBe("(x=20, y=-20)");
    });

    it("copyFrom test3", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point(20, 0);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=0)");
        expect(p2.toString()).toBe("(x=20, y=0)");
    });

    it("copyFrom test4", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point("a", 20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=0, y=20)");
        expect(p2.toString()).toBe("(x=0, y=20)");
    });

});

describe("Point.js distance test", function()
{

    it("distance test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test2", function()
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test3", function()
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test4", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test5", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test6", function()
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test7", function()
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test8", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test9", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test10", function()
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test11", function()
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test12", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test13", function()
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test14", function()
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test15", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test16", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test1", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(22.360679774997898);
    });

    it("distance test1", function()
    {
        let p1 = new Point(10, "a");
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(22.360679774997898);
    });

    it("distance test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point("a", 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, "a");
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

});

describe("Point.js equals test", function()
{

    it("equals test1", function()
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(10, 10);
        let p3 = new Point(10, 20);
        let p4 = new Point(20, 10);
        let p5 = new Point(20, 20);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(false);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test2", function()
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(-10, -10);
        let p3 = new Point(-10, -20);
        let p4 = new Point(-20, -10);
        let p5 = new Point(-20, -20);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(false);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test3", function()
    {
        let p1 = new Point(1, 10);
        let p2 = new Point(1, 10);
        let p3 = new Point(true, 10);
        let p4 = new Point(false, 10);
        let p5 = new Point(1, false);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test4", function()
    {
        let p1 = new Point(true, 10);
        let p2 = new Point(1, 10);
        let p3 = new Point(true, 10);
        let p4 = new Point(false, 10);
        let p5 = new Point(1, false);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals valid test1", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point(10, 10);

        expect(p1.equals(p2)).toBe(false);
    });

    it("equals valid test2", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point("a", 10);

        expect(p1.equals(p2)).toBe(true);
    });

    it("equals valid test3", function()
    {
        let p1 = new Point("a", "a");
        let p2 = new Point("a", "a");

        expect(p1.equals(p2)).toBe(true);
    });

});

describe("Point.js interpolate test", function()
{

    it("interpolate test1", function()
    {
        let p1 = new Point(0, 0);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=3, y=4)");
    });

    it("interpolate test2", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=9)");
    });

    it("interpolate test3", function()
    {
        let p1 = new Point(-9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=9)");
    });

    it("interpolate test4", function()
    {
        let p1 = new Point(9, -10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-1)");
    });

    it("interpolate test5", function()
    {
        let p1 = new Point(-9, -10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=-1)");
    });

    it("interpolate test6", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(-6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=9)");
    });

    it("interpolate test7", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=1)");
    });

    it("interpolate test8", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(-6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=1)");
    });

    it("interpolate test9", function()
    {
        let p1 = new Point(-9, 10);
        let p2 = new Point(-6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=9)");
    });

    it("interpolate test10", function()
    {
        let p1 = new Point(9, -10);
        let p2 = new Point(6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-9)");
    });

    it("interpolate test11", function()
    {
        let p1 = new Point(-9, -10);
        let p2 = new Point(-6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=-9)");
    });

    it("interpolate test12", function()
    {
        let p1 = new Point("a", 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=3, y=9)");
    });

    it("interpolate test13", function()
    {
        let p1 = new Point(9, "a");
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=4)");
    });

    it("interpolate test14", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -0.5);
        expect(p3.toString()).toBe("(x=4.5, y=7)");
    });

    it("interpolate test15", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, "a");
        expect(p3.toString()).toBe("(x=0, y=0)");
    });

    it("interpolate test16", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(9, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=9, y=9)");
    });

    it("interpolate test17", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1);
        expect(p3.toString()).toBe("(x=9, y=10)");
    });

    it("interpolate test18", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0);
        expect(p3.toString()).toBe("(x=6, y=8)");
    });

    it("interpolate test19", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1.5);
        expect(p3.toString()).toBe("(x=10.5, y=11)");
    });

    it("interpolate test20", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.2);
        expect(p3.toString()).toBe("(x=6.6, y=8.4)");
    });

    it("interpolate test21", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -0.2);
        expect(p3.toString()).toBe("(x=5.4, y=7.6)");
    });

    it("interpolate test22", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1.2);
        expect(p3.toString()).toBe("(x=9.6, y=10.4)");
    });

    it("interpolate test23", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -1.2);
        expect(p3.toString()).toBe("(x=2.3999999999999995, y=5.6)");
    });

    it("interpolate test24", function()
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=3, y=6)");
    });

    it("interpolate test25", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(9, 10);
        let p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=12, y=12)");
    });

});

describe("Point.js normalize test", function()
{

    it("normalize test1", function()
    {
        let p = new Point(6, 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=1.5, y=2)");
    });

    it("normalize test2", function()
    {
        let p = new Point(6, 8);
        p.normalize(0);
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test3", function()
    {
        let p = new Point(6, 8);
        p.normalize(-2.5);
        expect(p.toString()).toBe("(x=-1.5, y=-2)");
    });

    it("normalize test4", function()
    {
        let p = new Point(-6, 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=-1.5, y=2)");
    });

    it("normalize test5", function()
    {
        let p = new Point(6, -8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=1.5, y=-2)");
    });

    it("normalize test6", function()
    {
        let p = new Point(-6, -8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=-1.5, y=-2)");
    });

    it("normalize test7", function()
    {
        let p = new Point("a", 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=0, y=2.5)");
    });

    it("normalize test8", function()
    {
        let p = new Point(6, "a");
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=2.5, y=0)");
    });

    it("normalize test9", function()
    {
        let p = new Point(6, 8);
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test10", function()
    {
        let p = new Point("a", 8);
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test11", function()
    {
        let p = new Point(6, "a");
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });
});

describe("Point.js offset test", function()
{

    it("offset test1", function()
    {
        let p = new Point(10, 20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=40, y=60)");
    });

    it("offset test2", function()
    {
        let p = new Point(10, 20);
        p.offset(-30, 40);
        expect(p.toString()).toBe("(x=-20, y=60)");
    });

    it("offset test3", function()
    {
        let p = new Point(10, 20);
        p.offset(30, -40);
        expect(p.toString()).toBe("(x=40, y=-20)");
    });

    it("offset test4", function()
    {
        let p = new Point(-10, 20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=20, y=60)");
    });

    it("offset test5", function()
    {
        let p = new Point(10, -20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=40, y=20)");
    });

    it("offset test6", function()
    {
        let p = new Point("a", -20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=30, y=20)");
    });

    it("offset test7", function()
    {
        let p = new Point(10, -20);
        p.offset("a", 40);
        expect(p.toString()).toBe("(x=0, y=20)");
    });

    it("offset test8", function()
    {
        let p = new Point(10, "a");
        p.offset("a", 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });
});

describe("Point.js polar test", function()
{

    it("polar test1", function()
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=3.464101615137755, y=1.9999999999999998)"
        );
    });

    it("polar test2", function()
    {
        let angle = Math.PI * 2 * (45 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.8284271247461903, y=2.82842712474619)"
        );
    });

    it("polar test3", function()
    {
        let angle = Math.PI * 2 * (90 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.4492935982947064e-16, y=4)"
        );
    });

    it("polar test4", function()
    {
        let angle = Math.PI * 2 * (135 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.82842712474619, y=2.8284271247461903)"
        );
    });

    it("polar test5", function()
    {
        let angle = Math.PI * 2 * (180 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-4, y=4.898587196589413e-16)"
        );
    });

    it("polar test6", function()
    {
        let angle = Math.PI * 2 * (225 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.8284271247461907, y=-2.82842712474619)"
        );
    });

    it("polar test7", function()
    {
        let angle = Math.PI * 2 * (270 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-7.347880794884119e-16, y=-4)"
        );
    });

    it("polar test8", function()
    {
        let angle = Math.PI * 2 * (315 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        if (p.x > 2.8284271247461894) {
            expect(p.x).toBe(2.82842712474619);
        } else {
            expect(p.x).toBe(2.8284271247461894);
        }
        expect(p.y).toBe(-2.8284271247461907);
    });

    it("polar test9", function()
    {
        let angle = Math.PI * 2 * (360 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=4, y=-9.797174393178826e-16)"
        );
    });

    it("polar test10", function()
    {
        let angle = Math.PI * 2 * (-30 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=3.464101615137755, y=-1.9999999999999998)"
        );
    });

    it("polar test11", function()
    {
        let angle = Math.PI * 2 * (-45 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.8284271247461903, y=-2.82842712474619)"
        );
    });

    it("polar test12", function()
    {
        let angle = Math.PI * 2 * (-90 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.4492935982947064e-16, y=-4)"
        );
    });

    it("polar test13", function()
    {
        let angle = Math.PI * 2 * (-135 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.82842712474619, y=-2.8284271247461903)"
        );
    });

    it("polar test14", function()
    {
        let angle = Math.PI * 2 * (-180 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-4, y=-4.898587196589413e-16)"
        );
    });

    it("polar test15", function()
    {
        let angle = Math.PI * 2 * (-225 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.8284271247461907, y=2.82842712474619)"
        );
    });

    it("polar test16", function()
    {
        let angle = Math.PI * 2 * (-270 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-7.347880794884119e-16, y=4)"
        );
    });

    it("polar test17", function()
    {
        let angle = Math.PI * 2 * (-315 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        if (p.x > 2.8284271247461894) {
            expect(p.x).toBe(2.82842712474619);
        } else {
            expect(p.x).toBe(2.8284271247461894);
        }
        expect(p.y).toBe(2.8284271247461907);
    });

    it("polar test18", function()
    {
        let angle = Math.PI * 2 * (-360 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=4, y=9.797174393178826e-16)"
        );
    });

    it("polar test19", function()
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(0, angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test20", function()
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(-4, angle);
        expect(p.toString()).toBe(
            "(x=-3.464101615137755, y=-1.9999999999999998)"
        );
    });

    it("polar test21", function()
    {
        let angle = "a"; // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test22", function()
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar("a", angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test23", function()
    {
        let angle = "a"; // 30 degrees
        let p     = Point.polar("a", angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });
});

describe("Point.js setTo test", function()
{

    it("setTo test1", function()
    {
        let p = new Point(10, 20);
        p.setTo(30, 40);
        expect(p.toString()).toBe("(x=30, y=40)");
    });

    it("setTo test2", function()
    {
        let p = new Point("a", 20);
        p.setTo(30, 40);
        expect(p.toString()).toBe("(x=30, y=40)");
    });

    it("setTo test3", function()
    {
        let p = new Point(10, 20);
        p.setTo("a", 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });

    it("setTo test4", function()
    {
        let p = new Point(10, 20);
        p.setTo(0, 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });

});

describe("Point.js subtract test", function()
{

    it("subtract test1", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(1.5, 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=4.5, y=6)");
    });

    it("subtract test2", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(-1, 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=7, y=6)");
    });

    it("subtract test3", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point("a", 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=6, y=6)");
    });

    it("subtract test4", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(1, "a");
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=5, y=8)");
    });

    it("subtract test5", function()
    {
        let p1 = new Point(6, 8);
        let p2 = new Point("a", "a");
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=6, y=8)");
    });
});

//properties
describe("Point.js x test", function()
{

    it("default test case1", function()
    {
        let p = new Point();
        expect(p.x).toBe(0);
    });

    it("default test case2", function()
    {
        let p = new Point();
        p.x = null;
        expect(p.x).toBe(0);
    });

    it("default test case3", function()
    {
        let p = new Point();
        p.x = undefined;
        expect(p.x).toBe(0);
    });

    it("default test case4", function()
    {
        let p = new Point();
        p.x = true;
        expect(p.x).toBe(1);
    });

    it("default test case5", function()
    {
        let p = new Point();
        p.x = "";
        expect(p.x).toBe(0);
    });

    it("default test case6", function()
    {
        let p = new Point();
        p.x = "abc";
        expect(p.x).toBe(0);
    });

    it("default test case7", function()
    {
        let p = new Point();
        p.x = 0;
        expect(p.x).toBe(0);
    });

    it("default test case8", function()
    {
        let p = new Point();
        p.x = 1;
        expect(p.x).toBe(1);
    });

    it("default test case9", function()
    {
        let p = new Point();
        p.x = 500;
        expect(p.x).toBe(500);
    });

    it("default test case10", function()
    {
        let p = new Point();
        p.x = 50000000000000000;
        expect(p.x).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let p = new Point();
        p.x = -1;
        expect(p.x).toBe(-1);
    });

    it("default test case12", function()
    {
        let p = new Point();
        p.x = -500;
        expect(p.x).toBe(-500);
    });

    it("default test case13", function()
    {
        let p = new Point();
        p.x = -50000000000000000;
        expect(p.x).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let p = new Point();
        p.x = { "a":0 };
        expect(p.x).toBe(0);
    });

    it("default test case15", function()
    {
        let p = new Point();
        p.x = function a() {};
        expect(p.x).toBe(0);
    });

    it("default test case16", function()
    {
        let p = new Point();
        p.x = [1];
        expect(p.x).toBe(1);
    });

    it("default test case17", function()
    {
        let p = new Point();
        p.x = [1,2];
        expect(p.x).toBe(0);
    });

    it("default test case18", function()
    {
        let p = new Point();
        p.x = {};
        expect(p.x).toBe(0);
    });

    it("default test case19", function()
    {
        let p = new Point();
        p.x = { "toString":function () { return 1 } };
        expect(p.x).toBe(1);
    });

    it("default test case20", function()
    {
        let p = new Point();
        p.x = { "toString":function () { return "1" } };
        expect(p.x).toBe(1);
    });

    it("default test case21", function()
    {
        let p = new Point();
        p.x = { "toString":function () { return "1a" } };
        expect(p.x).toBe(0);
    });

});

describe("Point.js y test", function()
{

    it("default test case1", function()
    {
        let p = new Point();
        expect(p.y).toBe(0);
    });

    it("default test case2", function()
    {
        let p = new Point();
        p.y = null;
        expect(p.y).toBe(0);
    });

    it("default test case3", function()
    {
        let p = new Point();
        p.y = undefined;
        expect(p.y).toBe(0);
    });

    it("default test case4", function()
    {
        let p = new Point();
        p.y = true;
        expect(p.y).toBe(1);
    });

    it("default test case5", function()
    {
        let p = new Point();
        p.y = "";
        expect(p.y).toBe(0);
    });

    it("default test case6", function()
    {
        let p = new Point();
        p.y = "abc";
        expect(p.y).toBe(0);
    });

    it("default test case7", function()
    {
        let p = new Point();
        p.y = 0;
        expect(p.y).toBe(0);
    });

    it("default test case8", function()
    {
        let p = new Point();
        p.y = 1;
        expect(p.y).toBe(1);
    });

    it("default test case9", function()
    {
        let p = new Point();
        p.y = 500;
        expect(p.y).toBe(500);
    });

    it("default test case10", function()
    {
        let p = new Point();
        p.y = 50000000000000000;
        expect(p.y).toBe(Util.$SHORT_INT_MAX);
    });

    it("default test case11", function()
    {
        let p = new Point();
        p.y = -1;
        expect(p.y).toBe(-1);
    });

    it("default test case12", function()
    {
        let p = new Point();
        p.y = -500;
        expect(p.y).toBe(-500);
    });

    it("default test case13", function()
    {
        let p = new Point();
        p.y = -50000000000000000;
        expect(p.y).toBe(Util.$SHORT_INT_MIN);
    });

    it("default test case14", function()
    {
        let p = new Point();
        p.y = { "a":0 };
        expect(p.y).toBe(0);
    });

    it("default test case15", function()
    {
        let p = new Point();
        p.y = function a() {};
        expect(p.y).toBe(0);
    });

    it("default test case16", function()
    {
        let p = new Point();
        p.y = [1];
        expect(p.y).toBe(1);
    });

    it("default test case17", function()
    {
        let p = new Point();
        p.y = [1,2];
        expect(p.y).toBe(0);
    });

    it("default test case18", function()
    {
        let p = new Point();
        p.y = {};
        expect(p.y).toBe(0);
    });

    it("default test case19", function()
    {
        let p = new Point();
        p.y = { "toString":function () { return 1 } };
        expect(p.y).toBe(1);
    });

    it("default test case20", function()
    {
        let p = new Point();
        p.y = { "toString":function () { return "1" } };
        expect(p.y).toBe(1);
    });

    it("default test case21", function()
    {
        let p = new Point();
        p.y = { "toString":function () { return "1a" } };
        expect(p.y).toBe(0);
    });

});

describe("Point.js length test", function()
{

    it("default test case1", function()
    {
        let p = new Point();
        expect(p.length).toBe(0);
    });

    it("default test case2", function()
    {
        let p = new Point(10, 30);
        expect(p.length).toBe(31.622776601683793);
    });

});