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

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(20);
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

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(20);
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

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(20);
    });

    it("createBox test case4", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = -2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(20);
    });

    it("createBox test case5", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = 10;
        const ty = 20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(10);
        expect(matrix.ty).toBe(20);
    });

    it("createBox test case6", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = 2.0;
        const yScale = 3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case7", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);
        
        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case8", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.2246468525851679e-16);
        expect(matrix.b).toBe(3);
        expect(matrix.c).toBe(-2);
        expect(matrix.d).toBe(-1.8369702788777518e-16);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case9", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case10", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(3.6739405577555036e-16);
        expect(matrix.c).toBe(-2.4492937051703357e-16);
        expect(matrix.d).toBe(3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case11", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case12", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(3.6739402930577075e-16);
        expect(matrix.b).toBe(-3);
        expect(matrix.c).toBe(2);
        expect(matrix.d).toBe(5.510910704284357e-16);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case13", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case14", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = -2 * Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-2);
        expect(matrix.b).toBe(-7.347881115511007e-16);
        expect(matrix.c).toBe(4.898587410340671e-16);
        expect(matrix.d).toBe(-3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case15", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 0;
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-2);
        expect(matrix.b).toBe(-0);
        expect(matrix.c).toBe(-0);
        expect(matrix.d).toBe(-3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case16", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case17", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.2246468525851679e-16);
        expect(matrix.b).toBe(-3);
        expect(matrix.c).toBe(2);
        expect(matrix.d).toBe(-1.8369702788777518e-16);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case18", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case19", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(-3.6739405577555036e-16);
        expect(matrix.c).toBe(2.4492937051703357e-16);
        expect(matrix.d).toBe(3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case20", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case21", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(3.6739402930577075e-16);
        expect(matrix.b).toBe(3);
        expect(matrix.c).toBe(-2);
        expect(matrix.d).toBe(5.510910704284357e-16);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case22", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(2.1213202476501465);
        expect(matrix.c).toBe(-1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case23", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = 2 * Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-2);
        expect(matrix.b).toBe(7.347881115511007e-16);
        expect(matrix.c).toBe(-4.898587410340671e-16);
        expect(matrix.d).toBe(-3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case24", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (45 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.8477590084075928);
        expect(matrix.b).toBe(-1.148050308227539);
        expect(matrix.c).toBe(0.7653668522834778);
        expect(matrix.d).toBe(-2.7716383934020996);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case25", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (90 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(-2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case26", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (135 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-0.7653668522834778);
        expect(matrix.b).toBe(-2.7716383934020996);
        expect(matrix.c).toBe(1.8477590084075928);
        expect(matrix.d).toBe(-1.148050308227539);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case27", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (180 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(-1.2246468525851679e-16);
        expect(matrix.b).toBe(-3);
        expect(matrix.c).toBe(2);
        expect(matrix.d).toBe(-1.8369702788777518e-16);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case28", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (225 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(0.7653668522834778);
        expect(matrix.b).toBe(-2.7716383934020996);
        expect(matrix.c).toBe(1.8477590084075928);
        expect(matrix.d).toBe(1.148050308227539);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case29", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (270 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.4142135381698608);
        expect(matrix.b).toBe(-2.1213202476501465);
        expect(matrix.c).toBe(1.4142135381698608);
        expect(matrix.d).toBe(2.1213202476501465);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case30", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (315 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(1.8477590084075928);
        expect(matrix.b).toBe(-1.148050308227539);
        expect(matrix.c).toBe(0.7653668522834778);
        expect(matrix.d).toBe(2.7716383934020996);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });

    it("createBox test case31", () =>
    {
        const matrix = new Matrix(1, 0.5, -0.2);
        const xScale = -2.0;
        const yScale = -3.0;
        const rotation = Math.PI * (360 / 360);
        const tx = -10;
        const ty = -20;
        matrix.createBox(xScale, yScale, rotation, tx, ty);

        expect(matrix.a).toBe(2);
        expect(matrix.b).toBe(-3.6739405577555036e-16);
        expect(matrix.c).toBe(2.4492937051703357e-16);
        expect(matrix.d).toBe(3);
        expect(matrix.tx).toBe(-10);
        expect(matrix.ty).toBe(-20);
    });
});