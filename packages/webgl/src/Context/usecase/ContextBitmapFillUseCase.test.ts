import { execute } from "./ContextBitmapFillUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";

describe("ContextBitmapFillUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute bitmap fill", () =>
    {
        const pixels = new Uint8Array([255, 0, 0, 255]);
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const width = 2;
        const height = 2;
        const repeat = false;
        const smooth = true;

        expect(() => {
            execute(pixels, matrix, width, height, repeat, smooth);
        }).not.toThrow();
    });

    it("test case - should handle empty vertices", () =>
    {
        const pixels = new Uint8Array([]);
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const width = 0;
        const height = 0;
        const repeat = false;
        const smooth = false;

        expect(() => {
            execute(pixels, matrix, width, height, repeat, smooth);
        }).not.toThrow();
    });
});
