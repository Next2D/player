import { Matrix } from "../../../packages/geom/src/Matrix";
import { Point } from "../../../packages/geom/src/Point";
import {
    $SHORT_INT_MAX,
    $SHORT_INT_MIN
} from "../../../packages/share/src/RenderUtil";

describe("Matrix.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        const object = new Matrix();
        expect(object.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
    });

    it("toString test2 success", () =>
    {
        const object = new Matrix(2, 3, 4, 5, 6, 7);
        expect(object.toString()).toBe("(a=2, b=3, c=4, d=5, tx=6, ty=7)");
    });
});

describe("Matrix.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(Matrix.toString()).toBe("[class Matrix]");
    });

});

describe("Matrix.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new Matrix();
        expect(object.namespace).toBe("next2d.geom.Matrix");
    });

    it("namespace test static", () =>
    {
        expect(Matrix.namespace).toBe("next2d.geom.Matrix");
    });

});

describe("Matrix.js property valid test and clone test", () =>
{

    it("property success case1", () =>
    {
        let m = new Matrix();
        m.a   = 1.2;
        m.b   = 0.765;
        m.c   = -0.872;
        m.d   = -1.5;
        m.tx  = 10;
        m.ty  = -10;

        expect(m.a).toBe(1.2000000476837158);
        expect(m.b).toBe(0.7649999856948853);
        expect(m.c).toBe(-0.871999979019165);
        expect(m.d).toBe(-1.5);
        expect(m.tx).toBe(10);
        expect(m.ty).toBe(-10);
    });

    it("property success case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a   = "1.2";
        // @ts-ignore
        m.b   = "0.765";
        // @ts-ignore
        m.c   = "-0.872";
        // @ts-ignore
        m.d   = "-1.5";
        // @ts-ignore
        m.tx  = "10";
        // @ts-ignore
        m.ty  = "-10";

        expect(m.a).toBe(1.2000000476837158);
        expect(m.b).toBe(0.7649999856948853);
        expect(m.c).toBe(-0.871999979019165);
        expect(m.d).toBe(-1.5);
        expect(m.tx).toBe(10);
        expect(m.ty).toBe(-10);
    });

    it("valid and clone test", () =>
    {
        // valid
        // @ts-ignore
        let m1 = new Matrix("a", "b", "c", "d", "tx", "ty");
        // @ts-ignore
        m1.a   = "a";
        // @ts-ignore
        m1.b   = "b";
        // @ts-ignore
        m1.c   = "c";
        // @ts-ignore
        m1.d   = "d";
        // @ts-ignore
        m1.tx  = "tx";
        // @ts-ignore
        m1.ty  = "ty";

        // clone matrix
        let m2 = m1._$clone();
        m2.a   = 1.2;
        m2.b   = 0.765;
        m2.c   = -0.872;
        m2.d   = -1.5;
        m2.tx  = 10;
        m2.ty  = -10;

        // origin
        expect(m1.a).toBe(0);
        expect(m1.b).toBe(0);
        expect(m1.c).toBe(0);
        expect(m1.d).toBe(0);
        expect(m1.tx).toBe(0);
        expect(m1.ty).toBe(0);

        // clone
        expect(m2.a).toBe(1.2000000476837158);
        expect(m2.b).toBe(0.7649999856948853);
        expect(m2.c).toBe(-0.871999979019165);
        expect(m2.d).toBe(-1.5);
        expect(m2.tx).toBe(10);
        expect(m2.ty).toBe(-10);
    });
});

describe("Matrix.js concat test", () =>
{
    it("concat test1", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-17.5)"
        );
    });

    it("concat test2", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(0, 0.75, 0, -1.5, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=0, b=0, c=0, d=-2.25, tx=10, ty=-17.5)"
        );
    });

    it("concat test3", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(1.3, 0, 0, -1.5, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=2.5999999046325684, b=-1.5, c=-1.2999999523162842, d=-1.5, tx=10, ty=-17.5)"
        );
    });

    it("concat test4", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(1.3, 0.75, 0, 0, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=2.5999999046325684, b=1.5, c=-1.2999999523162842, d=-0.75, tx=10, ty=-10)"
        );
    });

    it("concat test5", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(1.3, 0.75, 0, -1.5, 0, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=0, ty=-17.5)"
        );
    });

    it("concat test6", () =>
    {
        let m1 = new Matrix(2, 1, -1, 1, 0, 5);
        let m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, 0);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=2.5999999046325684, b=0, c=-1.2999999523162842, d=-2.25, tx=10, ty=-7.5)"
        );
    });

    it("concat test7", () =>
    {
        let m1 = new Matrix(1,0,0,1,0,0);
        let m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=10, ty=-10)"
        );
    });

    it("concat test8", () =>
    {
        let m1 = new Matrix(1,0,0,1,10,10);
        let m2 = new Matrix(1.3, 0.75, 0, -1.5, 10, -10);
        m1.concat(m2);
        expect(m1.toString()).toBe(
            "(a=1.2999999523162842, b=0.75, c=0, d=-1.5, tx=23, ty=-17.5)"
        );
    });
});

describe("Matrix.js rotate test", () =>
{
    it("rotate test1", () =>
    {
        let m = new Matrix(1, 0, 0, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test2", () =>
    {
        let m = new Matrix(1, 0, 0, -1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=0.7071067690849304, b=0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test3", () =>
    {
        let m = new Matrix(-1, 0, 0, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-0.7071067690849304, b=-0.7071067690849304, c=-0.7071067690849304, d=0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test4", () =>
    {
        let m = new Matrix(-1, 0, 0, -1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-0.7071067690849304, b=-0.7071067690849304, c=0.7071067690849304, d=-0.7071067690849304, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test5", () =>
    {
        let m = new Matrix(1, 10, 10, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test6", () =>
    {
        let m = new Matrix(1, -10, 10, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=7.77817440032959, b=-6.363961219787598, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test7", () =>
    {
        let m = new Matrix(1, 10, -10, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=-7.77817440032959, d=-6.363961219787598, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test8", () =>
    {
        let m = new Matrix(1, 10, 10, 1, -100, 110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-148.492431640625, ty=7.071067810058594)"
        );
    });

    it("rotate test9", () =>
    {
        let m = new Matrix(1, 10, 10, 1, 100, -110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=148.492431640625, ty=-7.071067810058594)"
        );
    });

    it("rotate test10", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=6.363961219787598, b=-7.77817440032959, c=-6.363961219787598, d=-7.77817440032959, tx=7.071067810058594, ty=-148.492431640625)"
        );
    });

    it("rotate test11", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(0.5);
        expect(m.toString()).toBe(
            "(a=3.916672706604004, b=-9.255250930786133, c=-8.29640007019043, d=-5.67183780670166, tx=-35.021446228027344, ty=-144.4766387939453)"
        );
    });

    it("rotate test12", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(-0.5);
        expect(m.toString()).toBe(
            "(a=-5.67183780670166, b=-8.29640007019043, c=-9.255250930786133, d=3.916672706604004, tx=-140.4950714111328, ty=-48.591529846191406)"
        );
    });

    it("rotate test13", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(90 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=10, b=-1, c=1, d=-10, tx=110, ty=-100)"
        );
    });

    it("rotate test14", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(135 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=7.77817440032959, b=6.363961219787598, c=7.77817440032959, d=-6.363961219787598, tx=148.492431640625, ty=7.071067810058594)"
        );
    });

    it("rotate test15", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(Math.PI);
        expect(m.toString()).toBe(
            "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
        );
    });

    it("rotate test16", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(-45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-7.77817440032959, b=-6.363961219787598, c=-7.77817440032959, d=6.363961219787598, tx=-148.492431640625, ty=-7.071067810058594)"
        );
    });

    it("rotate test17", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(-90 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-10, b=1, c=-1, d=10, tx=-110, ty=100)"
        );
    });

    it("rotate test18", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(-135 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=-6.363961219787598, b=7.77817440032959, c=6.363961219787598, d=7.77817440032959, tx=-7.071067810058594, ty=148.492431640625)"
        );
    });

    it("rotate test19", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        m.rotate(-1 * Math.PI);
        expect(m.toString()).toBe(
            "(a=1, b=10, c=10, d=1, tx=100, ty=110)"
        );
    });

    it("rotate test20", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        // @ts-ignore
        m.rotate("a");
        expect(m.toString()).toBe(
            "(a=0, b=0, c=0, d=0, tx=0, ty=0)"
        );
    });

    it("rotate test21", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        // @ts-ignore
        m.a = "a";
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=7.071067810058594, b=-7.071067810058594, c=-6.363961219787598, d=-7.77817440032959, tx=7.071067810058594, ty=-148.492431640625)"
        );
    });

    it("rotate test22", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        // @ts-ignore
        m.c = "a";
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=6.363961219787598, b=-7.77817440032959, c=0.7071067690849304, d=-0.7071067690849304, tx=7.071067810058594, ty=-148.492431640625)"
        );
    });

    it("rotate test23", () =>
    {
        let m = new Matrix(-1, -10, -10, -1, -100, -110);
        // @ts-ignore
        m.tx = "a";
        m.rotate(45 / 180 * Math.PI);
        expect(m.toString()).toBe(
            "(a=6.363961219787598, b=-7.77817440032959, c=-6.363961219787598, d=-7.77817440032959, tx=77.78174591064453, ty=-77.78174591064453)"
        );
    });
});

describe("Matrix.js createGradientBox test", () =>
{
    it("createGradientBox test1", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 0, 9, 0, 0);
        expect(m.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=0)"
        );
    });

    it("createGradientBox test2", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 9, 0, 0);
        expect(m.toString()).toBe(
            "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=0.5, ty=0.5)"
        );
    });

    it("createGradientBox test3", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 0, 9, 1, 0);
        expect(m.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=1.5, ty=0)"
        );
    });

    it("createGradientBox test4", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 0, 9, 0, 1);
        expect(m.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=1)"
        );
    });

    it("createGradientBox test5", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 9, 1, 1);
        expect(m.toString()).toBe(
            "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test6", () =>
    {
        let m = new Matrix();
        m.createGradientBox(-1, -1, -9, -1, -1);
        expect(m.toString()).toBe(
            "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=-1.5, ty=-1.5)"
        );
    });

    it("createGradientBox test7", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.createGradientBox("a", -1, -9, -1, -1);
        expect(m.toString()).toBe(
            "(a=0, b=0.0002515371597837657, c=0, d=0.0005561097641475499, tx=0, ty=-1.5)"
        );
    });

    it("createGradientBox test8", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.createGradientBox(-1, "a", -9, -1, -1);
        expect(m.toString()).toBe(
            "(a=0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=-1.5, ty=0)"
        );
    });

    it("createGradientBox test9", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.createGradientBox(-1, -1, "a", -1, -1);
        expect(m.toString()).toBe(
            "(a=0, b=0, c=0, d=0, tx=-1.5, ty=-1.5)"
        );
    });

    it("createGradientBox test10", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.createGradientBox(-1, -1, -9, "a", -1);
        expect(m.toString()).toBe(
            "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=0, ty=-1.5)"
        );
    });

    it("createGradientBox test11", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.createGradientBox(-1, -1, -9, -1, "a");
        expect(m.toString()).toBe(
            "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=-1.5, ty=0)"
        );
    });

    it("createGradientBox test12", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 45 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test13", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 90 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=3.7373254383716084e-20, b=0.0006103515625, c=-0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test14", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 135 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=-0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test15", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, 180 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=-0.0006103515625, b=7.474650876743217e-20, c=-7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test16", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, -45 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test17", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, -90 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=3.7373254383716084e-20, b=-0.0006103515625, c=0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test18", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, -135 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=-0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test19", () =>
    {
        let m = new Matrix();
        m.createGradientBox(1, 1, -180 / 180 * Math.PI, 1, 1);
        expect(m.toString()).toBe(
            "(a=-0.0006103515625, b=-7.474650876743217e-20, c=7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
        );
    });
});

describe("Matrix.js createBox test", () =>
{
    it("createBox test1", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = 2.0;
        let sy = 3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = 10;
        let ty = 20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test2", () =>
    {
        let m = new Matrix(-1, 0.5, -0.2);
        let sx = 2.0;
        let sy = 3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = 10;
        let ty = 20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test3", () =>
    {
        let m = new Matrix(-1, -0.5, -0.2);
        let sx = 2.0;
        let sy = 3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = 10;
        let ty = 20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test4", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = 2.0;
        let sy = 3.0;
        let r  = -2 * Math.PI * (45 / 360);
        let tx = 10;
        let ty = 20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test5", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = 10;
        let ty = 20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test6", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = 2.0;
        let sy = 3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test7", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test8", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (90 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=3, c=-2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test9", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (135 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test10", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (180 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=3.6739405577555036e-16, c=-2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });

    it("createBox test11", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (225 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test12", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (270 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=3.6739402930577075e-16, b=-3, c=2, d=5.510910704284357e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test13", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (315 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);

        expect(m.a).toBe(-1.4142135381698608);
        expect(m.b).toBe(-2.1213202476501465);
        expect(m.c).toBe(1.4142135381698608);
        expect(m.d).toBe(-2.1213202476501465);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test14", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = -2 * Math.PI * (360 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=-7.347881115511007e-16, c=4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test15", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = "a";
        let tx = -10;
        let ty = -20;
        // @ts-ignore
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=0, b=0, c=0, d=0, tx=-10, ty=-20)"
        );
    });

    it("createBox test16", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = "a";
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        // @ts-ignore
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=0, b=-2.1213202476501465, c=0, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test17", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = "a";
        let ty = -20;
        // @ts-ignore
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=0, ty=-20)"
        );
    });

    it("createBox test18", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        // @ts-ignore
        m.a = "a";
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test19", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        // @ts-ignore
        m.c = "a";
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test20", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        // @ts-ignore
        m.tx = "a";
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test21", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 0;
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=0, c=0, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test22", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test23", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (90 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test24", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (135 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test25", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (180 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });

    it("createBox test26", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (225 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test27", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (270 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=3.6739402930577075e-16, b=3, c=-2, d=5.510910704284357e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test28", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (315 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);

        expect(m.a).toBe(-1.4142135381698608);
        expect(m.b).toBe(2.1213202476501465);
        expect(m.c).toBe(-1.4142135381698608);
        expect(m.d).toBe(-2.1213202476501465);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test29", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = 2 * Math.PI * (360 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=7.347881115511007e-16, c=-4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test30", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (45 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.8477590084075928, b=-1.148050308227539, c=0.7653668522834778, d=-2.7716383934020996, tx=-10, ty=-20)"
        );
    });

    it("createBox test31", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (90 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test32", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (135 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=-1.148050308227539, tx=-10, ty=-20)"
        );
    });

    it("createBox test33", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (180 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test34", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (225 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=1.148050308227539, tx=-10, ty=-20)"
        );
    });

    it("createBox test35", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (270 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test36", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (315 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);

        expect(m.a).toBe(1.8477590084075928);
        expect(m.b).toBe(-1.148050308227539);
        expect(m.c).toBe(0.7653668522834778);
        expect(m.d).toBe(2.7716383934020996);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test37", () =>
    {
        let m = new Matrix(1, 0.5, -0.2);
        let sx = -2.0;
        let sy = -3.0;
        let r  = Math.PI * (360 / 360);
        let tx = -10;
        let ty = -20;
        m.createBox(sx, sy, r, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });
});

describe("Matrix.js invert test", () =>
{
    it("invert test1", () =>
    {
        let m = new Matrix(2, 1, 1, 2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=0.6666666865348816, b=-0.3333333432674408, c=-0.3333333432674408, d=0.6666666865348816, tx=66.66667175292969, ty=66.66667175292969)"
        );
    });

    it("invert test2", () =>
    {
        let m = new Matrix(2, 1, 1, 2, -200, -200);
        m.invert();
        m.invert();
        expect(m.toString()).toBe(
            "(a=2, b=1, c=1, d=2, tx=-200.00001525878906, ty=-200.00001525878906)"
        );
    });

    it("invert test3", () =>
    {
        let m = new Matrix(-2, 1, 1, 2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=-0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=-40, ty=120)"
        );
    });

    it("invert test4", () =>
    {
        let m = new Matrix(2, -1, 1, 2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=0.4000000059604645, b=0.20000000298023224, c=-0.20000000298023224, d=0.4000000059604645, tx=40, ty=120)"
        );
    });

    it("invert test5", () =>
    {
        let m = new Matrix(2, 1, -1, 2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=0.4000000059604645, b=-0.20000000298023224, c=0.20000000298023224, d=0.4000000059604645, tx=120, ty=40)"
        );
    });

    it("invert test6", () =>
    {
        let m = new Matrix(2, 1, 1, -2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=0.4000000059604645, b=0.20000000298023224, c=0.20000000298023224, d=-0.4000000059604645, tx=120, ty=-40)"
        );
    });

    it("invert test7", () =>
    {
        let m = new Matrix(-2, -1, -1, -2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=-0.6666666865348816, b=0.3333333432674408, c=0.3333333432674408, d=-0.6666666865348816, tx=-66.66667175292969, ty=-66.66667175292969)"
        );
    });

    it("invert test8", () =>
    {
        // @ts-ignore
        let m = new Matrix("a", -1, -1, -2, -200, -200);
        m.invert();
        expect(m.toString()).toBe(
            "(a=2, b=-1, c=-1, d=0, tx=200, ty=-200)"
        );
    });
});

describe("Matrix.js transformPoint test", () =>
{
    it("transformPoint test1", () =>
    {
        let m = new Matrix(1, 0, 0, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-19.79898965358734, y=164.04878056049347)"
        );
    });

    it("transformPoint test2", () =>
    {
        let m = new Matrix(1, 1, 0, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-21.213203191757202, y=165.46299409866333)"
        );
    });

    it("transformPoint test3", () =>
    {
        let m = new Matrix(1, 0, 1, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-5);
        expect(p2.y | 0).toBe(178);

    });

    it("transformPoint test4", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-7);
        expect(p2.y | 0).toBe(179);
    });

    it("transformPoint test5", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-7);
        expect(p2.y | 0).toBe(117);
    });

    it("transformPoint test6", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        // @ts-ignore
        m.rotate("a");

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("transformPoint test7", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        // @ts-ignore
        m.a = "a";
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-5);
        expect(p2.y | 0).toBe(118);
    });

    it("transformPoint test8", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        // @ts-ignore
        m.c = "a";
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=7.071067571640015, y=131.52186918258667)"
        );
    });

    it("transformPoint test9", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        // @ts-ignore
        m.tx = "a";
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-77.78174591064453, y=46.66904807090759)"
        );
    });

    it("transformPoint test10", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        // @ts-ignore
        p1.x = "a";
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-7);
        expect(p2.y | 0).toBe(120);
    });

    it("transformPoint test11", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(-7);
        expect(p2.y | 0).toBe(117);
    });

    it("transformPoint test12", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(90 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-88, y=78)"
        );
    });

    it("transformPoint test13", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(135 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-117.37973380088806, y=-7.071067810058596)"
        );
    });

    it("transformPoint test14", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(180 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-78, y=-88)"
        );
    });

    it("transformPoint test15", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(-45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.x | 0).toBe(117);
        expect(p2.y | 0).toBe(7);

    });

    it("transformPoint test16", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(-90 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=88, y=-78)"
        );
    });

    it("transformPoint test17", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(-135 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=7.071067810058591, y=-117.37973380088806)"
        );
    });

    it("transformPoint test18", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.rotate(-180 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.transformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-78, y=-88)"
        );
    });
});

describe("Matrix.js deltaTransformPoint test", () =>
{
    it("deltaTransformPoint test1", () =>
    {
        let m = new Matrix(1, 0, 0, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-12.727921843528748, y=15.55634891986847)"
        );
    });

    it("deltaTransformPoint test2", () =>
    {
        let m = new Matrix(10, 0, 0, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=2.384185791015625e-7, y=28.284271001815796)"
        );
    });

    it("deltaTransformPoint test3", () =>
    {
        let m = new Matrix(1, 10, 0, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(-26);
        expect(p2.y | 0).toBe(29);
    });

    it("deltaTransformPoint test4", () =>
    {
        let m = new Matrix(1, 0, 10, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=128.6934379339218, y=156.97770154476166)"
        );
    });

    it("deltaTransformPoint test5", () =>
    {
        let m = new Matrix(1, 0, 0, 10, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-140.007142663002, y=142.83556973934174)"
        );
    });

    it("deltaTransformPoint test6", () =>
    {
        let m = new Matrix(-1, 0, 0, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-15.55634891986847, y=12.727921843528748)"
        );
    });

    it("deltaTransformPoint test7", () =>
    {
        let m = new Matrix(1, 0, 0, -1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=15.55634891986847, y=-12.727921843528748)"
        );
    });

    it("deltaTransformPoint test8", () =>
    {
        let m = new Matrix(-1, 0, 0, -1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=12.727921843528748, y=-15.55634891986847)"
        );
    });

    it("deltaTransformPoint test9", () =>
    {
        let m = new Matrix(-1, -1, 0, -1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=14.142135381698608, y=-16.97056245803833)"
        );
    });

    it("deltaTransformPoint test10", () =>
    {
        let m = new Matrix(-1, 0, -1, -1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(-1);
        expect(p2.y | 0).toBe(-29);
    });

    it("deltaTransformPoint test11", () =>
    {
        let m = new Matrix(-1, -1, -1, -1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(-31);
    });

    it("deltaTransformPoint test12", () =>
    {
        // @ts-ignore
        let m = new Matrix("a", 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(-1);
        expect(p2.y | 0).toBe(29);

    });

    it("deltaTransformPoint test13", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        // @ts-ignore
        m.translate("a", 0);
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(31);
    });

    it("deltaTransformPoint test14", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        // @ts-ignore
        m.translate(10, "a");
        m.rotate(45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(31);
    });

    it("deltaTransformPoint test15", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        // @ts-ignore
        let p1 = new Point("a", 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(28);
    });

    it("deltaTransformPoint test16", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(45 / 180 * Math.PI);

        // @ts-ignore
        let p1 = new Point(2, "a");
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(2);
    });

    it("deltaTransformPoint test17", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);

        // @ts-ignore
        m.rotate("a");

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=0, y=0)"
        );
    });

    it("deltaTransformPoint test18", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(90 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-22, y=22)"
        );
    });

    it("deltaTransformPoint test19", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(135 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-31.11269783973694, y=2.4424906541753444e-15)"
        );
    });

    it("deltaTransformPoint test20", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(180 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-22, y=-22)"
        );
    });

    it("deltaTransformPoint test21", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(-45 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(31);
        expect(p2.y | 0).toBe(0);
    });

    it("deltaTransformPoint test22", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(-90 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=22, y=-22)"
        );
    });

    it("deltaTransformPoint test23", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(-135 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.x | 0).toBe(0);
        expect(p2.y | 0).toBe(-31);

    });

    it("deltaTransformPoint test24", () =>
    {
        let m = new Matrix(1, 1, 1, 1, 100, 110);
        m.translate(10, 0);
        m.rotate(-180 / 180 * Math.PI);

        let p1 = new Point(2, 20);
        let p2 = m.deltaTransformPoint(p1);

        expect(p2.toString()).toBe(
            "(x=-22, y=-22)"
        );
    });
});

describe("Matrix.js pattern test", () =>
{

    it("pattern test case1", () =>
    {
        let matrix = new Matrix();

        // 単位行列化
        matrix.identity();
        // 拡大縮小成分を乗算
        matrix.scale( 256 / 1638.4 , 256 / 1638.4 );
        // 角度成分を乗算
        matrix.rotate(Math.PI / 180);
        // 移動成分を乗算
        matrix.translate( 128.0 , 128.0 );

        expect(matrix.toString()).toBe("(a=0.15622620284557343, b=0.0027269385755062103, c=-0.0027269385755062103, d=0.15622620284557343, tx=128, ty=128)");
    });

});

describe("Matrix.js scale test", () =>
{

    it("scale test case1", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 2);
        expect(matrix.toString()).toBe("(a=2, b=1, c=-1, d=2, tx=0, ty=0)");
    });

    it("scale test case2", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(2, 3);
        expect(matrix.toString()).toBe("(a=2, b=1.5, c=-1, d=3, tx=0, ty=0)");
    });

    it("scale test case3", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 0, 0);
        matrix.scale(3, 2);
        expect(matrix.toString()).toBe("(a=3, b=1, c=-1.5, d=2, tx=0, ty=0)");
    });

    it("scale test case4", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 10, 0);
        matrix.scale(-1, 2);
        expect(matrix.toString()).toBe("(a=-1, b=1, c=0.5, d=2, tx=-10, ty=0)");
    });

    it("scale test case5", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
        matrix.scale(3, -2);
        expect(matrix.toString()).toBe("(a=3, b=-1, c=-1.5, d=-2, tx=0, ty=-20)");
    });

    it("scale test case6", () =>
    {
        let matrix = new Matrix(1, 0.5, -0.5, 1, 0, 10);
        // @ts-ignore
        matrix.scale("a", 2);
        expect(matrix.toString()).toBe("(a=0, b=1, c=0, d=2, tx=0, ty=20)");
    });

});

describe("Matrix.js a test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.a).toBe(1);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = null;
        expect(m.a).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = undefined;
        expect(m.a).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = true;
        expect(m.a).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = "";
        expect(m.a).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = "abc";
        expect(m.a).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.a = 0;
        expect(m.a).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.a = 1;
        expect(m.a).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.a = 500;
        expect(m.a).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.a = 50000000000000000;
        expect(m.a).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.a = -1;
        expect(m.a).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.a = -500;
        expect(m.a).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.a = -50000000000000000;
        expect(m.a).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = { "a":0 };
        expect(m.a).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = function a() {};
        expect(m.a).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = [1];
        expect(m.a).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = [1,2];
        expect(m.a).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = {};
        expect(m.a).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = { "toString":function () { return 1 } };
        expect(m.a).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = { "toString":function () { return "1" } };
        expect(m.a).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.a = { "toString":function () { return "1a" } };
        expect(m.a).toBe(0);
    });

});

describe("Matrix.js b test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.b).toBe(0);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = null;
        expect(m.b).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = undefined;
        expect(m.b).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = true;
        expect(m.b).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = "";
        expect(m.b).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = "abc";
        expect(m.b).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.b = 0;
        expect(m.b).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.b = 1;
        expect(m.b).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.b = 500;
        expect(m.b).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.b = 50000000000000000;
        expect(m.b).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.b = -1;
        expect(m.b).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.b = -500;
        expect(m.b).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.b = -50000000000000000;
        expect(m.b).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = { "a":0 };
        expect(m.b).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = function a() {};
        expect(m.b).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = [1];
        expect(m.b).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = [1,2];
        expect(m.b).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = {};
        expect(m.b).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = { "toString":function () { return 1 } };
        expect(m.b).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = { "toString":function () { return "1" } };
        expect(m.b).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.b = { "toString":function () { return "1a" } };
        expect(m.b).toBe(0);
    });

});

describe("Matrix.js c test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.c).toBe(0);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = null;
        expect(m.c).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = undefined;
        expect(m.c).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = true;
        expect(m.c).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = "";
        expect(m.c).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = "abc";
        expect(m.c).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.c = 0;
        expect(m.c).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.c = 1;
        expect(m.c).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.c = 500;
        expect(m.c).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.c = 50000000000000000;
        expect(m.c).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.c = -1;
        expect(m.c).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.c = -500;
        expect(m.c).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.c = -50000000000000000;
        expect(m.c).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = { "a":0 };
        expect(m.c).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = function a() {};
        expect(m.c).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = [1];
        expect(m.c).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = [1,2];
        expect(m.c).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = {};
        expect(m.c).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = { "toString":function () { return 1 } };
        expect(m.c).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = { "toString":function () { return "1" } };
        expect(m.c).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.c = { "toString":function () { return "1a" } };
        expect(m.c).toBe(0);
    });

});

describe("Matrix.js d test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.d).toBe(1);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = null;
        expect(m.d).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = undefined;
        expect(m.d).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = true;
        expect(m.d).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = "";
        expect(m.d).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = "abc";
        expect(m.d).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.d = 0;
        expect(m.d).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.d = 1;
        expect(m.d).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.d = 500;
        expect(m.d).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.d = 50000000000000000;
        expect(m.d).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.d = -1;
        expect(m.d).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.d = -500;
        expect(m.d).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.d = -50000000000000000;
        expect(m.d).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = { "a":0 };
        expect(m.d).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = function a() {};
        expect(m.d).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = [1];
        expect(m.d).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = [1,2];
        expect(m.d).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = {};
        expect(m.d).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = { "toString":function () { return 1 } };
        expect(m.d).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = { "toString":function () { return "1" } };
        expect(m.d).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.d = { "toString":function () { return "1a" } };
        expect(m.d).toBe(0);
    });

});

describe("Matrix.js tx test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.tx).toBe(0);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = null;
        expect(m.tx).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = undefined;
        expect(m.tx).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = true;
        expect(m.tx).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = "";
        expect(m.tx).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = "abc";
        expect(m.tx).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.tx = 0;
        expect(m.tx).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.tx = 1;
        expect(m.tx).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.tx = 500;
        expect(m.tx).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.tx = 50000000000000000;
        expect(m.tx).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.tx = -1;
        expect(m.tx).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.tx = -500;
        expect(m.tx).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.tx = -50000000000000000;
        expect(m.tx).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = { "a":0 };
        expect(m.tx).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = function a() {};
        expect(m.tx).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = [1];
        expect(m.tx).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = [1,2];
        expect(m.tx).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = {};
        expect(m.tx).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = { "toString":function () { return 1 } };
        expect(m.tx).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = { "toString":function () { return "1" } };
        expect(m.tx).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.tx = { "toString":function () { return "1a" } };
        expect(m.tx).toBe(0);
    });

});

describe("Matrix.js ty test", () =>
{

    it("default test case1", () =>
    {
        let m = new Matrix();
        expect(m.ty).toBe(0);
    });

    it("default test case2", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = null;
        expect(m.ty).toBe(0);
    });

    it("default test case3", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = undefined;
        expect(m.ty).toBe(0);
    });

    it("default test case4", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = true;
        expect(m.ty).toBe(1);
    });

    it("default test case5", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = "";
        expect(m.ty).toBe(0);
    });

    it("default test case6", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = "abc";
        expect(m.ty).toBe(0);
    });

    it("default test case7", () =>
    {
        let m = new Matrix();
        m.ty = 0;
        expect(m.ty).toBe(0);
    });

    it("default test case8", () =>
    {
        let m = new Matrix();
        m.ty = 1;
        expect(m.ty).toBe(1);
    });

    it("default test case9", () =>
    {
        let m = new Matrix();
        m.ty = 500;
        expect(m.ty).toBe(500);
    });

    it("default test case10", () =>
    {
        let m = new Matrix();
        m.ty = 50000000000000000;
        expect(m.ty).toBe($SHORT_INT_MAX);
    });

    it("default test case11", () =>
    {
        let m = new Matrix();
        m.ty = -1;
        expect(m.ty).toBe(-1);
    });

    it("default test case12", () =>
    {
        let m = new Matrix();
        m.ty = -500;
        expect(m.ty).toBe(-500);
    });

    it("default test case13", () =>
    {
        let m = new Matrix();
        m.ty = -50000000000000000;
        expect(m.ty).toBe($SHORT_INT_MIN);
    });

    it("default test case14", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = { "a":0 };
        expect(m.ty).toBe(0);
    });

    it("default test case15", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = function a() {};
        expect(m.ty).toBe(0);
    });

    it("default test case16", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = [1];
        expect(m.ty).toBe(1);
    });

    it("default test case17", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = [1,2];
        expect(m.ty).toBe(0);
    });

    it("default test case18", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = {};
        expect(m.ty).toBe(0);
    });

    it("default test case19", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = { "toString":function () { return 1 } };
        expect(m.ty).toBe(1);
    });

    it("default test case20", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = { "toString":function () { return "1" } };
        expect(m.ty).toBe(1);
    });

    it("default test case21", () =>
    {
        let m = new Matrix();
        // @ts-ignore
        m.ty = { "toString":function () { return "1a" } };
        expect(m.ty).toBe(0);
    });

});

describe("Matrix.js BugFix", () =>
{
    it("default test case10", () =>
    {
        let mat = new Matrix();
        expect(mat.toString()).toBe("(a=1, b=0, c=0, d=1, tx=0, ty=0)");
        mat.translate(-100, -100);
        expect(mat.toString()).toBe("(a=1, b=0, c=0, d=1, tx=-100, ty=-100)");
        mat.scale(0.0, 1.0);
        expect(mat.toString()).toBe("(a=0, b=0, c=0, d=1, tx=0, ty=-100)");
        mat.translate(100, 100);
        expect(mat.toString()).toBe("(a=0, b=0, c=0, d=1, tx=100, ty=0)");

    });
});

describe("Matrix.js copyFrom", () =>
{
    it("copy test case1", () =>
    {

        const defaultMatrix = new Matrix();
        expect(defaultMatrix.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=0, ty=0)"
        );

        const matrix = new Matrix(1, 2, 3, 4, 5, 6);
        defaultMatrix.copyFrom(matrix);
        expect(defaultMatrix.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

        defaultMatrix.a  = 1;
        defaultMatrix.b  = 0;
        defaultMatrix.c  = 0;
        defaultMatrix.d  = 1;
        defaultMatrix.tx = 100;
        defaultMatrix.ty = 200;
        expect(defaultMatrix.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=100, ty=200)"
        );

        expect(matrix.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

    });

});

describe("Matrix.js setTo", () =>
{
    it("copy test case1", () =>
    {

        const matrix = new Matrix();
        expect(matrix.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=0, ty=0)"
        );

        matrix.setTo(1, 2, 3, 4, 5, 6);
        expect(matrix.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

    });
});

describe("Matrix.js identity", () =>
{
    it("clear test case1", () =>
    {

        const matrix = new Matrix(1, 2, 3, 4, 5, 6);
        expect(matrix.toString()).toBe(
            "(a=1, b=2, c=3, d=4, tx=5, ty=6)"
        );

        matrix.identity();
        expect(matrix.toString()).toBe(
            "(a=1, b=0, c=0, d=1, tx=0, ty=0)"
        );

    });
});