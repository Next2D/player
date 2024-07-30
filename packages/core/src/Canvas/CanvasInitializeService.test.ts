import { execute } from "./CanvasInitializeService";
import { describe, expect, it } from "vitest";

describe("CanvasInitializeService.js test", () =>
{
    it("execute test case1", () =>
    {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        execute(canvas, 1);
        expect(canvas.width).toBe(1);
        expect(canvas.height).toBe(1);
        expect(canvas.getAttribute("style")).toBe(
            "-webkit-tap-highlight-color: rgba(0,0,0,0);backface-visibility: hidden;"
        );
    });

    it("execute test case2", () =>
    {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        execute(canvas, 2);
        expect(canvas.width).toBe(1);
        expect(canvas.height).toBe(1);
        expect(canvas.getAttribute("style")).toBe(
            "-webkit-tap-highlight-color: rgba(0,0,0,0);backface-visibility: hidden;transform: scale(0.5);"
        );
    });
});