import { Matrix } from "../../../packages/geom/src/Matrix";
import { Point } from "../../../packages/geom/src/Point";
import {
    $SHORT_INT_MAX,
    $SHORT_INT_MIN
} from "../../../packages/share/src/RenderUtil";

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