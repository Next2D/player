import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js createBox test", () =>
{
    it("createBox test case1", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);
        expect(matrix.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test case2", () =>
    {
        const matrix = new Matrix(-1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation  = 2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);
        expect(matrix.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test case3", () =>
    {
        const matrix = new Matrix(-1, -0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);
        expect(matrix.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test case4", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = -2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test case5", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=10, ty=20)"
        );
    });

    it("createBox test case6", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case7", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case8", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=3, c=-2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test case9", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case10", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=3.6739405577555036e-16, c=-2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });

    it("createBox test case11", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case12", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=3.6739402930577075e-16, b=-3, c=2, d=5.510910704284357e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test case13", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);

        expect(m.a).toBe(-1.4142135381698608);
        expect(m.b).toBe(-2.1213202476501465);
        expect(m.c).toBe(1.4142135381698608);
        expect(m.d).toBe(-2.1213202476501465);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test case14", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=-7.347881115511007e-16, c=4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test case15", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 0;
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=0, c=0, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test case16", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case17", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test case18", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case19", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });

    it("createBox test case20", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=2.1213202476501465, c=-1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case21", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=3.6739402930577075e-16, b=3, c=-2, d=5.510910704284357e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test case22", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);

        expect(m.a).toBe(-1.4142135381698608);
        expect(m.b).toBe(2.1213202476501465);
        expect(m.c).toBe(-1.4142135381698608);
        expect(m.d).toBe(-2.1213202476501465);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test case23", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-2, b=7.347881115511007e-16, c=-4.898587410340671e-16, d=-3, tx=-10, ty=-20)"
        );
    });

    it("createBox test case24", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.8477590084075928, b=-1.148050308227539, c=0.7653668522834778, d=-2.7716383934020996, tx=-10, ty=-20)"
        );
    });

    it("createBox test case25", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=-2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case26", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=-1.148050308227539, tx=-10, ty=-20)"
        );
    });

    it("createBox test case27", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=-1.2246468525851679e-16, b=-3, c=2, d=-1.8369702788777518e-16, tx=-10, ty=-20)"
        );
    });

    it("createBox test case28", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=0.7653668522834778, b=-2.7716383934020996, c=1.8477590084075928, d=1.148050308227539, tx=-10, ty=-20)"
        );
    });

    it("createBox test case29", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=1.4142135381698608, b=-2.1213202476501465, c=1.4142135381698608, d=2.1213202476501465, tx=-10, ty=-20)"
        );
    });

    it("createBox test case30", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);

        expect(m.a).toBe(1.8477590084075928);
        expect(m.b).toBe(-1.148050308227539);
        expect(m.c).toBe(0.7653668522834778);
        expect(m.d).toBe(2.7716383934020996);
        expect(m.tx).toBe(-10);
        expect(m.ty).toBe(-20);
    });

    it("createBox test case31", () =>
    {
        const m = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        m.createBox(xScale, yScale, rotation, tx, ty);
        expect(m.toString()).toBe(
            "(a=2, b=-3.6739405577555036e-16, c=2.4492937051703357e-16, d=3, tx=-10, ty=-20)"
        );
    });
});