import { execute } from "./VideoHitTestUseCase";
import { Video } from "@next2d/media";
import { describe, expect, it, beforeEach } from "vitest";

describe("VideoHitTestUseCase.js test", () =>
{
    let canvas: HTMLCanvasElement;
    let context: CanvasRenderingContext2D;

    beforeEach(() =>
    {
        canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        context = canvas.getContext("2d") as CanvasRenderingContext2D;
    });

    it("execute test case1 - returns false for zero width Video", () =>
    {
        const video = new Video(0, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 100, y: 100 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case2 - returns false for zero height Video", () =>
    {
        const video = new Video(640, 0);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 100, y: 100 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case3 - returns false for negative width", () =>
    {
        const video = new Video(-640, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 100, y: 100 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case4 - returns false for negative height", () =>
    {
        const video = new Video(640, -480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 100, y: 100 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(result).toBe(false);
    });

    it("execute test case5 - uses identity matrix", () =>
    {
        const video = new Video(640, 480);
        
        const identityMatrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 320, y: 240 };
        
        const result = execute(video, context, identityMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case6 - uses translated matrix", () =>
    {
        const video = new Video(640, 480);
        
        const translatedMatrix = new Float32Array([1, 0, 0, 1, 100, 100]);
        const hitObject = { x: 420, y: 340 };
        
        const result = execute(video, context, translatedMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case7 - uses scaled matrix", () =>
    {
        const video = new Video(320, 240);
        
        const scaledMatrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const hitObject = { x: 320, y: 240 };
        
        const result = execute(video, context, scaledMatrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case8 - validates return type", () =>
    {
        const video = new Video(640, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 320, y: 240 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
        expect([true, false]).toContain(result);
    });

    it("execute test case9 - handles different hit positions", () =>
    {
        const video = new Video(640, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        const hitObject1 = { x: 320, y: 240 };
        const result1 = execute(video, context, matrix, hitObject1);
        expect(typeof result1).toBe("boolean");
        
        const hitObject2 = { x: 1000, y: 1000 };
        const result2 = execute(video, context, matrix, hitObject2);
        expect(typeof result2).toBe("boolean");
    });

    it("execute test case10 - validates context usage", () =>
    {
        const video = new Video(640, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 320, y: 240 };
        
        expect(context).toBeDefined();
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case11 - handles Video boundaries", () =>
    {
        const video = new Video(640, 480);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        
        // Test corners
        const corner1 = execute(video, context, matrix, { x: 0, y: 0 });
        const corner2 = execute(video, context, matrix, { x: 640, y: 480 });
        
        expect(typeof corner1).toBe("boolean");
        expect(typeof corner2).toBe("boolean");
    });

    it("execute test case12 - handles HD video size", () =>
    {
        const video = new Video(1920, 1080);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 960, y: 540 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case13 - handles small video size", () =>
    {
        const video = new Video(320, 240);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 160, y: 120 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case14 - handles square video", () =>
    {
        const video = new Video(512, 512);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 256, y: 256 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });

    it("execute test case15 - handles portrait video", () =>
    {
        const video = new Video(480, 640);
        
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const hitObject = { x: 240, y: 320 };
        
        const result = execute(video, context, matrix, hitObject);
        
        expect(typeof result).toBe("boolean");
    });
});
