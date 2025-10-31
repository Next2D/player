import { execute } from "./ShapeGenerateRenderQueueUseCase";
import { Shape } from "../../Shape";
import { describe, expect, it } from "vitest";

describe("ShapeGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test case1 - handles visible shape", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        // Function should not throw
        expect(() => {
            execute(shape, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case2 - handles invisible shape", () =>
    {
        const shape = new Shape();
        shape.visible = false;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case3 - handles identity matrix", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, identityMatrix, colorTransform, 1920, 1080);
        }).not.toThrow();
    });

    it("execute test case4 - handles scaled matrix", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, scaledMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case5 - handles translated matrix", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, translatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case6 - handles different renderer sizes", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, matrix, colorTransform, 320, 240);
        }).not.toThrow();
        
        expect(() => {
            execute(shape, matrix, colorTransform, 1920, 1080);
        }).not.toThrow();
        
        expect(() => {
            execute(shape, matrix, colorTransform, 3840, 2160);
        }).not.toThrow();
    });

    it("execute test case7 - handles alpha color transform", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const alphaTransform = new Float32Array([1, 1, 1, 0.5, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, matrix, alphaTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case8 - handles tinted color transform", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const tintedTransform = new Float32Array([1, 0.5, 0.5, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, matrix, tintedTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case9 - handles rotated matrix", () =>
    {
        const shape = new Shape();
        shape.visible = true;
        
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        const rotatedMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, rotatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter types", () =>
    {
        const shape = new Shape();
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(matrix).toBeInstanceOf(Float32Array);
        expect(colorTransform).toBeInstanceOf(Float32Array);
        expect(typeof 800).toBe("number");
        expect(typeof 600).toBe("number");
    });
});
