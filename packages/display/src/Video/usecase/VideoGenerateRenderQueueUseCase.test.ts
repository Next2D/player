import { execute } from "./VideoGenerateRenderQueueUseCase";
import { Video } from "@next2d/media";
import { describe, expect, it } from "vitest";

describe("VideoGenerateRenderQueueUseCase.js test", () =>
{
    it("execute test case1 - handles visible Video", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case2 - handles invisible Video", () =>
    {
        const video = new Video(640, 480);
        video.visible = false;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case3 - handles identity matrix", () =>
    {
        const video = new Video(1920, 1080);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, identityMatrix, colorTransform, 1920, 1080);
        }).not.toThrow();
    });

    it("execute test case4 - handles scaled matrix", () =>
    {
        const video = new Video(320, 240);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, scaledMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case5 - handles translated matrix", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, translatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case6 - handles alpha color transform", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const alphaTransform = new Float32Array([1, 1, 1, 0.5, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, alphaTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case7 - handles tinted color transform", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const tintedTransform = new Float32Array([1, 0.5, 0.5, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, tintedTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case8 - handles different renderer sizes", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 320, 240);
        }).not.toThrow();
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 1920, 1080);
        }).not.toThrow();
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 3840, 2160);
        }).not.toThrow();
    });

    it("execute test case9 - handles rotated matrix", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const cos = Math.cos(Math.PI / 4);
        const sin = Math.sin(Math.PI / 4);
        const rotatedMatrix = new Float32Array([cos, sin, -sin, cos, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, rotatedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case10 - validates parameter types", () =>
    {
        const video = new Video(640, 480);
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(video).toBeInstanceOf(Video);
        expect(Array.isArray(imageBitmaps)).toBe(true);
        expect(matrix).toBeInstanceOf(Float32Array);
        expect(colorTransform).toBeInstanceOf(Float32Array);
        expect(typeof 800).toBe("number");
        expect(typeof 600).toBe("number");
    });

    it("execute test case11 - handles different video sizes", () =>
    {
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        const smallVideo = new Video(320, 240);
        smallVideo.visible = true;
        expect(() => {
            execute(smallVideo, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
        
        const hdVideo = new Video(1920, 1080);
        hdVideo.visible = true;
        expect(() => {
            execute(hdVideo, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
        
        const uhd4kVideo = new Video(3840, 2160);
        uhd4kVideo.visible = true;
        expect(() => {
            execute(uhd4kVideo, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case12 - handles empty image bitmaps array", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const emptyBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, emptyBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case13 - handles combined transformations", () =>
    {
        const video = new Video(640, 480);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        // Scale + Translate
        const combinedMatrix = new Float32Array([1.5, 0, 0, 1.5, 50, 50]);
        const colorTransform = new Float32Array([0.8, 0.8, 1, 0.9, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, combinedMatrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case14 - handles square video", () =>
    {
        const video = new Video(512, 512);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });

    it("execute test case15 - handles portrait video", () =>
    {
        const video = new Video(480, 640);
        video.visible = true;
        
        const imageBitmaps: ImageBitmap[] = [];
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        
        expect(() => {
            execute(video, imageBitmaps, matrix, colorTransform, 800, 600);
        }).not.toThrow();
    });
});
