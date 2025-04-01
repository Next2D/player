import { execute } from "./BitmapDataCanvasToBufferService";
import { describe, expect, it } from "vitest";

describe("BitmapDataCanvasToBufferService.js test", () =>
{
    it("execute test", () =>
    {
        const canvas = document.createElement("canvas");

        const buffer = execute(canvas);
        expect(buffer.length).toBe(180000);
    });
});