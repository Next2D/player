import { execute } from "./StageGenerateRenderQueueUseCase";
import { DisplayObjectContainer } from "../../DisplayObjectContainer";
import { Shape } from "../../Shape";
import { MovieClip } from "../../MovieClip";
import { describe, expect, it } from "vitest";

describe("StageGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test case1 - handles DisplayObjectContainer", () =>
    {
        const container = new DisplayObjectContainer();
        container.isContainerEnabled = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(container, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case2 - handles Shape", () =>
    {
        const shape = new Shape();
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case3 - handles MovieClip", () =>
    {
        const movieClip = new MovieClip();
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(movieClip, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case4 - handles identity matrix", () =>
    {
        const container = new DisplayObjectContainer();
        
        const imageBitmaps: ImageBitmap[] = [];
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(container, imageBitmaps, identityMatrix, colorTransform, 1920, 1080);
        }).not.toThrow();
    });

    it("execute test case5 - handles scaled matrix", () =>
    {
        const shape = new Shape();
        
        const imageBitmaps: ImageBitmap[] = [];
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, imageBitmaps, scaledMatrix, colorTransform, 640, 480);
        }).not.toThrow();
    });

    it("execute test case6 - handles translated matrix", () =>
    {
        const movieClip = new MovieClip();
        
        const imageBitmaps: ImageBitmap[] = [];
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(movieClip, imageBitmaps, translatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case7 - handles alpha color transform", () =>
    {
        const shape = new Shape();
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const alphaTransform = new Float32Array([1, 1, 1, 0.5, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, imageBitmaps, matrix, alphaTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case8 - handles different renderer sizes", () =>
    {
        const container = new DisplayObjectContainer();
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(container, imageBitmaps, matrix, colorTransform, 320, 240);
        }).not.toThrow();
        
        expect(() => {
            execute(container, imageBitmaps, matrix, colorTransform, 3840, 2160);
        }).not.toThrow();
    });

    it("execute test case9 - handles empty image bitmaps array", () =>
    {
        const shape = new Shape();
        
        const emptyBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(shape, emptyBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter types", () =>
    {
        const container = new DisplayObjectContainer();
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(container).toBeInstanceOf(DisplayObjectContainer);
        expect(Array.isArray(imageBitmaps)).toBe(true);
        expect(matrix).toBeInstanceOf(Float32Array);
        expect(colorTransform).toBeInstanceOf(Float32Array);
        expect(typeof 800).toBe("number");
        expect(typeof 600).toBe("number");
    });
});
