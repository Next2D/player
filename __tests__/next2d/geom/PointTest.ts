import { Point } from "../../../src/next2d/geom/Point";
import {
    $SHORT_INT_MAX,
    $SHORT_INT_MIN
} from "../../../src/util/RenderUtil";

describe("Point.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const object = new Point();
        expect(object.toString()).toBe("(x=0, y=0)");
    });

    it("toString test2 success", () =>
    {
        const object = new Point(1, 2);
        expect(object.toString()).toBe("(x=1, y=2)");
    });
});

describe("Point.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Point.toString()).toBe("[class Point]");
    });

});

describe("Point.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new Point();
        expect(object.namespace).toBe("next2d.geom.Point");
    });

    it("namespace test static", () =>
    {
        expect(Point.namespace).toBe("next2d.geom.Point");
    });

});

describe("Point.js property valid test and clone test", () =>
{

    it("valid and clone test", function () {

        // @ts-ignore
        let p1 = new Point("a", "b");
        // @ts-ignore
        p1.x = "a";
        // @ts-ignore
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

describe("Point.js add test", () =>
{

    it("add test1", () =>
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

    it("add test2", () =>
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

    it("add test3", () =>
    {
        // @ts-ignore
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

describe("Point.js copyFrom test", () =>
{

    it("copyFrom test1", () =>
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, 20);

        p1.copyFrom(p2);
        p1.x = 10;

        expect(p1.toString()).toBe("(x=10, y=20)");
        expect(p2.toString()).toBe("(x=20, y=20)");
    });

    it("copyFrom test2", () =>
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, -20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=-20)");
        expect(p2.toString()).toBe("(x=20, y=-20)");
    });

    it("copyFrom test3", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", 10);
        let p2 = new Point(20, 0);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=20, y=0)");
        expect(p2.toString()).toBe("(x=20, y=0)");
    });

    it("copyFrom test4", () =>
    {
        let p1 = new Point(10, 10);
        // @ts-ignore
        let p2 = new Point("a", 20);

        p1.copyFrom(p2);

        expect(p1.toString()).toBe("(x=0, y=20)");
        expect(p2.toString()).toBe("(x=0, y=20)");
    });

});

describe("Point.js distance test", () =>
{

    it("distance test1", () =>
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test2", () =>
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test3", () =>
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test4", () =>
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test5", () =>
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test6", () =>
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test7", () =>
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test8", () =>
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test9", () =>
    {
        let p1 = new Point(10, 10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test10", () =>
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test11", () =>
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(42.42640687119285);
    });

    it("distance test12", () =>
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(-20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test13", () =>
    {
        let p1 = new Point(10, -10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test14", () =>
    {
        let p1 = new Point(-10, 10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test15", () =>
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(31.622776601683793);
    });

    it("distance test16", () =>
    {
        let p1 = new Point(-10, -10);
        let p2 = new Point(-20, -20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test1", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", 10);
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(22.360679774997898);
    });

    it("distance test1", () =>
    {
        // @ts-ignore
        let p1 = new Point(10, "a");
        let p2 = new Point(20, 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(22.360679774997898);
    });

    it("distance test1", () =>
    {
        let p1 = new Point(10, 10);
        // @ts-ignore
        let p2 = new Point("a", 20);
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

    it("distance test1", () =>
    {
        let p1 = new Point(10, 10);
        // @ts-ignore
        let p2 = new Point(20, "a");
        let d  = Point.distance(p1, p2);
        expect(d).toBe(14.142135623730951);
    });

});

describe("Point.js equals test", () =>
{

    it("equals test1", () =>
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

    it("equals test2", () =>
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

    it("equals test3", () =>
    {
        let p1 = new Point(1, 10);
        let p2 = new Point(1, 10);
        // @ts-ignore
        let p3 = new Point(true, 10);
        // @ts-ignore
        let p4 = new Point(false, 10);
        // @ts-ignore
        let p5 = new Point(1, false);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals test4", () =>
    {
        // @ts-ignore
        let p1 = new Point(true, 10);
        let p2 = new Point(1, 10);
        // @ts-ignore
        let p3 = new Point(true, 10);
        // @ts-ignore
        let p4 = new Point(false, 10);
        // @ts-ignore
        let p5 = new Point(1, false);

        expect(p1.equals(p2)).toBe(true);
        expect(p1.equals(p3)).toBe(true);
        expect(p1.equals(p4)).toBe(false);
        expect(p1.equals(p5)).toBe(false);
    });

    it("equals valid test1", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", 10);
        let p2 = new Point(10, 10);

        expect(p1.equals(p2)).toBe(false);
    });

    it("equals valid test2", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", 10);
        // @ts-ignore
        let p2 = new Point("a", 10);

        expect(p1.equals(p2)).toBe(true);
    });

    it("equals valid test3", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", "a");
        // @ts-ignore
        let p2 = new Point("a", "a");

        expect(p1.equals(p2)).toBe(true);
    });

});

describe("Point.js interpolate test", () =>
{

    it("interpolate test1", () =>
    {
        let p1 = new Point(0, 0);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=3, y=4)");
    });

    it("interpolate test2", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=9)");
    });

    it("interpolate test3", () =>
    {
        let p1 = new Point(-9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=9)");
    });

    it("interpolate test4", () =>
    {
        let p1 = new Point(9, -10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-1)");
    });

    it("interpolate test5", () =>
    {
        let p1 = new Point(-9, -10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-1.5, y=-1)");
    });

    it("interpolate test6", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(-6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=9)");
    });

    it("interpolate test7", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=1)");
    });

    it("interpolate test8", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(-6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=1.5, y=1)");
    });

    it("interpolate test9", () =>
    {
        let p1 = new Point(-9, 10);
        let p2 = new Point(-6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=9)");
    });

    it("interpolate test10", () =>
    {
        let p1 = new Point(9, -10);
        let p2 = new Point(6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=-9)");
    });

    it("interpolate test11", () =>
    {
        let p1 = new Point(-9, -10);
        let p2 = new Point(-6, -8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=-7.5, y=-9)");
    });

    it("interpolate test12", () =>
    {
        // @ts-ignore
        let p1 = new Point("a", 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=3, y=9)");
    });

    it("interpolate test13", () =>
    {
        // @ts-ignore
        let p1 = new Point(9, "a");
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=7.5, y=4)");
    });

    it("interpolate test14", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -0.5);
        expect(p3.toString()).toBe("(x=4.5, y=7)");
    });

    it("interpolate test15", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        // @ts-ignore
        let p3 = Point.interpolate(p1, p2, "a");
        expect(p3.toString()).toBe("(x=0, y=0)");
    });

    it("interpolate test16", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(9, 8);
        let p3 = Point.interpolate(p1, p2, 0.5);
        expect(p3.toString()).toBe("(x=9, y=9)");
    });

    it("interpolate test17", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1);
        expect(p3.toString()).toBe("(x=9, y=10)");
    });

    it("interpolate test18", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0);
        expect(p3.toString()).toBe("(x=6, y=8)");
    });

    it("interpolate test19", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1.5);
        expect(p3.toString()).toBe("(x=10.5, y=11)");
    });

    it("interpolate test20", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 0.2);
        expect(p3.toString()).toBe("(x=6.6, y=8.4)");
    });

    it("interpolate test21", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -0.2);
        expect(p3.toString()).toBe("(x=5.4, y=7.6)");
    });

    it("interpolate test22", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, 1.2);
        expect(p3.toString()).toBe("(x=9.6, y=10.4)");
    });

    it("interpolate test23", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -1.2);
        expect(p3.toString()).toBe("(x=2.3999999999999995, y=5.6)");
    });

    it("interpolate test24", () =>
    {
        let p1 = new Point(9, 10);
        let p2 = new Point(6, 8);
        let p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=3, y=6)");
    });

    it("interpolate test25", () =>
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(9, 10);
        let p3 = Point.interpolate(p1, p2, -1);
        expect(p3.toString()).toBe("(x=12, y=12)");
    });

});

describe("Point.js normalize test", () =>
{

    it("normalize test1", () =>
    {
        let p = new Point(6, 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=1.5, y=2)");
    });

    it("normalize test2", () =>
    {
        let p = new Point(6, 8);
        p.normalize(0);
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test3", () =>
    {
        let p = new Point(6, 8);
        p.normalize(-2.5);
        expect(p.toString()).toBe("(x=-1.5, y=-2)");
    });

    it("normalize test4", () =>
    {
        let p = new Point(-6, 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=-1.5, y=2)");
    });

    it("normalize test5", () =>
    {
        let p = new Point(6, -8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=1.5, y=-2)");
    });

    it("normalize test6", () =>
    {
        let p = new Point(-6, -8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=-1.5, y=-2)");
    });

    it("normalize test7", () =>
    {
        // @ts-ignore
        let p = new Point("a", 8);
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=0, y=2.5)");
    });

    it("normalize test8", () =>
    {
        // @ts-ignore
        let p = new Point(6, "a");
        p.normalize(2.5);
        expect(p.toString()).toBe("(x=2.5, y=0)");
    });

    it("normalize test9", () =>
    {
        let p = new Point(6, 8);
        // @ts-ignore
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test10", () =>
    {
        // @ts-ignore
        let p = new Point("a", 8);
        // @ts-ignore
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });

    it("normalize test11", () =>
    {
        // @ts-ignore
        let p = new Point(6, "a");
        // @ts-ignore
        p.normalize("a");
        expect(p.toString()).toBe("(x=0, y=0)");
    });
});

describe("Point.js offset test", () =>
{

    it("offset test1", () =>
    {
        let p = new Point(10, 20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=40, y=60)");
    });

    it("offset test2", () =>
    {
        let p = new Point(10, 20);
        p.offset(-30, 40);
        expect(p.toString()).toBe("(x=-20, y=60)");
    });

    it("offset test3", () =>
    {
        let p = new Point(10, 20);
        p.offset(30, -40);
        expect(p.toString()).toBe("(x=40, y=-20)");
    });

    it("offset test4", () =>
    {
        let p = new Point(-10, 20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=20, y=60)");
    });

    it("offset test5", () =>
    {
        let p = new Point(10, -20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=40, y=20)");
    });

    it("offset test6", () =>
    {
        // @ts-ignore
        let p = new Point("a", -20);
        p.offset(30, 40);
        expect(p.toString()).toBe("(x=30, y=20)");
    });

    it("offset test7", () =>
    {
        let p = new Point(10, -20);
        // @ts-ignore
        p.offset("a", 40);
        expect(p.toString()).toBe("(x=0, y=20)");
    });

    it("offset test8", () =>
    {
        // @ts-ignore
        let p = new Point(10, "a");
        // @ts-ignore
        p.offset("a", 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });
});

describe("Point.js polar test", () =>
{

    it("polar test1", () =>
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=3.464101615137755, y=1.9999999999999998)"
        );
    });

    it("polar test2", () =>
    {
        let angle = Math.PI * 2 * (45 / 360); // 30 degrees
        let p     = Point.polar(4, angle);

        expect(p.x | 0).toBe(2);
        expect(p.y | 0).toBe(2);

    });

    it("polar test3", () =>
    {
        let angle = Math.PI * 2 * (90 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.4492935982947064e-16, y=4)"
        );
    });

    it("polar test4", () =>
    {
        let angle = Math.PI * 2 * (135 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.82842712474619, y=2.8284271247461903)"
        );
    });

    it("polar test5", () =>
    {
        let angle = Math.PI * 2 * (180 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-4, y=4.898587196589413e-16)"
        );
    });

    it("polar test6", () =>
    {
        let angle = Math.PI * 2 * (225 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.8284271247461907, y=-2.82842712474619)"
        );
    });

    it("polar test7", () =>
    {
        let angle = Math.PI * 2 * (270 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-7.347880794884119e-16, y=-4)"
        );
    });

    it("polar test8", () =>
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

    it("polar test9", () =>
    {
        let angle = Math.PI * 2 * (360 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=4, y=-9.797174393178826e-16)"
        );
    });

    it("polar test10", () =>
    {
        let angle = Math.PI * 2 * (-30 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=3.464101615137755, y=-1.9999999999999998)"
        );
    });

    it("polar test11", () =>
    {
        let angle = Math.PI * 2 * (-45 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.x | 0).toBe(2);
        expect(p.y | 0).toBe(-2);
    });

    it("polar test12", () =>
    {
        let angle = Math.PI * 2 * (-90 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=2.4492935982947064e-16, y=-4)"
        );
    });

    it("polar test13", () =>
    {
        let angle = Math.PI * 2 * (-135 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.82842712474619, y=-2.8284271247461903)"
        );
    });

    it("polar test14", () =>
    {
        let angle = Math.PI * 2 * (-180 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-4, y=-4.898587196589413e-16)"
        );
    });

    it("polar test15", () =>
    {
        let angle = Math.PI * 2 * (-225 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-2.8284271247461907, y=2.82842712474619)"
        );
    });

    it("polar test16", () =>
    {
        let angle = Math.PI * 2 * (-270 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=-7.347880794884119e-16, y=4)"
        );
    });

    it("polar test17", () =>
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

    it("polar test18", () =>
    {
        let angle = Math.PI * 2 * (-360 / 360); // 30 degrees
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=4, y=9.797174393178826e-16)"
        );
    });

    it("polar test19", () =>
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(0, angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test20", () =>
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        let p     = Point.polar(-4, angle);
        expect(p.toString()).toBe(
            "(x=-3.464101615137755, y=-1.9999999999999998)"
        );
    });

    it("polar test21", () =>
    {
        let angle = "a"; // 30 degrees
        // @ts-ignore
        let p     = Point.polar(4, angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test22", () =>
    {
        let angle = Math.PI * 2 * (30 / 360); // 30 degrees
        // @ts-ignore
        let p     = Point.polar("a", angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("polar test23", () =>
    {
        let angle = "a"; // 30 degrees
        // @ts-ignore
        let p     = Point.polar("a", angle);
        expect(p.toString()).toBe(
            "(x=0, y=0)"
        );
    });
});

describe("Point.js setTo test", () =>
{

    it("setTo test1", () =>
    {
        let p = new Point(10, 20);
        p.setTo(30, 40);
        expect(p.toString()).toBe("(x=30, y=40)");
    });

    it("setTo test2", () =>
    {
        // @ts-ignore
        let p = new Point("a", 20);
        p.setTo(30, 40);
        expect(p.toString()).toBe("(x=30, y=40)");
    });

    it("setTo test3", () =>
    {
        let p = new Point(10, 20);
        // @ts-ignore
        p.setTo("a", 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });

    it("setTo test4", () =>
    {
        let p = new Point(10, 20);
        p.setTo(0, 40);
        expect(p.toString()).toBe("(x=0, y=40)");
    });

});

describe("Point.js subtract test", () =>
{

    it("subtract test1", () =>
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(1.5, 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=4.5, y=6)");
    });

    it("subtract test2", () =>
    {
        let p1 = new Point(6, 8);
        let p2 = new Point(-1, 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=7, y=6)");
    });

    it("subtract test3", () =>
    {
        let p1 = new Point(6, 8);
        // @ts-ignore
        let p2 = new Point("a", 2);
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=6, y=6)");
    });

    it("subtract test4", () =>
    {
        let p1 = new Point(6, 8);
        // @ts-ignore
        let p2 = new Point(1, "a");
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=5, y=8)");
    });

    it("subtract test5", () =>
    {
        let p1 = new Point(6, 8);
        // @ts-ignore
        let p2 = new Point("a", "a");
        let p3 = p1.subtract(p2);
        expect(p3.toString()).toBe("(x=6, y=8)");
    });
});

//properties
describe("Point.js x test", () =>
{

    it("default test case1", () =>
    {
        let p = new Point();
        expect(p.x).toBe(0);
    });

    it("default test case2", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = null;
        expect(p.x).toBe(0);
    });

    it("default test case3", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = undefined;
        expect(p.x).toBe(0);
    });

    it("default test case4", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = true;
        expect(p.x).toBe(1);
    });

    it("default test case5", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = "";
        expect(p.x).toBe(0);
    });

    it("default test case6", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = "abc";
        expect(p.x).toBe(0);
    });

    it("default test case7", () =>
    {
        let p = new Point();
        p.x = 0;
        expect(p.x).toBe(0);
    });

    it("default test case8", () =>
    {
        let p = new Point();
        p.x = 1;
        expect(p.x).toBe(1);
    });

    it("default test case9", () =>
    {
        let p = new Point();
        p.x = 500;
        expect(p.x).toBe(500);
    });

    it("default test case10", () =>
    {
        let p = new Point();
        p.x = 50000000000000000;
        expect(p.x).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let p = new Point();
        p.x = -1;
        expect(p.x).toBe(-1);
    });

    it("default test case12", () =>
    {
        let p = new Point();
        p.x = -500;
        expect(p.x).toBe(-500);
    });

    it("default test case13", () =>
    {
        let p = new Point();
        p.x = -50000000000000000;
        expect(p.x).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = { "a":0 };
        expect(p.x).toBe(0);
    });

    it("default test case15", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = function a() {};
        expect(p.x).toBe(0);
    });

    it("default test case16", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = [1];
        expect(p.x).toBe(1);
    });

    it("default test case17", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = [1,2];
        expect(p.x).toBe(0);
    });

    it("default test case18", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = {};
        expect(p.x).toBe(0);
    });

    it("default test case19", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = { "toString":function () { return 1 } };
        expect(p.x).toBe(1);
    });

    it("default test case20", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = { "toString":function () { return "1" } };
        expect(p.x).toBe(1);
    });

    it("default test case21", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.x = { "toString":function () { return "1a" } };
        expect(p.x).toBe(0);
    });

});

describe("Point.js y test", () =>
{

    it("default test case1", () =>
    {
        let p = new Point();
        expect(p.y).toBe(0);
    });

    it("default test case2", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = null;
        expect(p.y).toBe(0);
    });

    it("default test case3", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = undefined;
        expect(p.y).toBe(0);
    });

    it("default test case4", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = true;
        expect(p.y).toBe(1);
    });

    it("default test case5", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = "";
        expect(p.y).toBe(0);
    });

    it("default test case6", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = "abc";
        expect(p.y).toBe(0);
    });

    it("default test case7", () =>
    {
        let p = new Point();
        p.y = 0;
        expect(p.y).toBe(0);
    });

    it("default test case8", () =>
    {
        let p = new Point();
        p.y = 1;
        expect(p.y).toBe(1);
    });

    it("default test case9", () =>
    {
        let p = new Point();
        p.y = 500;
        expect(p.y).toBe(500);
    });

    it("default test case10", () =>
    {
        let p = new Point();
        p.y = 50000000000000000;
        expect(p.y).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let p = new Point();
        p.y = -1;
        expect(p.y).toBe(-1);
    });

    it("default test case12", () =>
    {
        let p = new Point();
        p.y = -500;
        expect(p.y).toBe(-500);
    });

    it("default test case13", () =>
    {
        let p = new Point();
        p.y = -50000000000000000;
        expect(p.y).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = { "a":0 };
        expect(p.y).toBe(0);
    });

    it("default test case15", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = function a() {};
        expect(p.y).toBe(0);
    });

    it("default test case16", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = [1];
        expect(p.y).toBe(1);
    });

    it("default test case17", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = [1,2];
        expect(p.y).toBe(0);
    });

    it("default test case18", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = {};
        expect(p.y).toBe(0);
    });

    it("default test case19", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = { "toString":function () { return 1 } };
        expect(p.y).toBe(1);
    });

    it("default test case20", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = { "toString":function () { return "1" } };
        expect(p.y).toBe(1);
    });

    it("default test case21", () =>
    {
        let p = new Point();
        // @ts-ignore
        p.y = { "toString":function () { return "1a" } };
        expect(p.y).toBe(0);
    });

});

describe("Point.js length test", () =>
{

    it("default test case1", () =>
    {
        let p = new Point();
        expect(p.length).toBe(0);
    });

    it("default test case2", () =>
    {
        let p = new Point(10, 30);
        expect(p.length).toBe(31.622776601683793);
    });

});