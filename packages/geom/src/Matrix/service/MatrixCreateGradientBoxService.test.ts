import { Matrix } from "../../Matrix";
import { describe, expect, it } from "vitest";

describe("Matrix.js createGradientBox test", () =>
{
    it("createGradientBox test case1", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 0, 9, 0, 0);
        expect(matrix.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=0)"
        );
    });

    it("createGradientBox test case2", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 9, 0, 0);
        expect(matrix.toString()).toBe(
            "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=0.5, ty=0.5)"
        );
    });

    it("createGradientBox test case3", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 0, 9, 1, 0);
        expect(matrix.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=1.5, ty=0)"
        );
    });

    it("createGradientBox test case4", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 0, 9, 0, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0005561097641475499, b=0, c=-0.0002515371597837657, d=0, tx=0.5, ty=1)"
        );
    });

    it("createGradientBox test case5", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 9, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=-0.0005561097641475499, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case6", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(-1, -1, -9, -1, -1);
        expect(matrix.toString()).toBe(
            "(a=0.0005561097641475499, b=0.0002515371597837657, c=-0.0002515371597837657, d=0.0005561097641475499, tx=-1.5, ty=-1.5)"
        );
    });

    it("createGradientBox test case6", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 45 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case7", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 90 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=3.7373254383716084e-20, b=0.0006103515625, c=-0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case8", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 135 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0004315837286412716, b=0.0004315837286412716, c=-0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case9", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, 180 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0006103515625, b=7.474650876743217e-20, c=-7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case10", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, -45 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case11", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, -90 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=3.7373254383716084e-20, b=-0.0006103515625, c=0.0006103515625, d=3.7373254383716084e-20, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case12", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, -135 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0004315837286412716, b=-0.0004315837286412716, c=0.0004315837286412716, d=-0.0004315837286412716, tx=1.5, ty=1.5)"
        );
    });

    it("createGradientBox test case13", () =>
    {
        const matrix = new Matrix();
        matrix.createGradientBox(1, 1, -180 / 180 * Math.PI, 1, 1);
        expect(matrix.toString()).toBe(
            "(a=-0.0006103515625, b=-7.474650876743217e-20, c=7.474650876743217e-20, d=-0.0006103515625, tx=1.5, ty=1.5)"
        );
    });
});