import { execute } from "./GradientLUTGenerateDataUseCase";
import { describe, expect, it } from "vitest";

describe("GradientLUTGenerateDataUseCase.ts method test", () =>
{
    it("test case - generates LUT data for simple gradient", () =>
    {
        const stops = [
            0, 1, 0, 0, 1,   // ratio=0, red
            1, 0, 0, 1, 1    // ratio=1, blue
        ];

        const result = execute(stops, 0);

        expect(result.pixels).toBeInstanceOf(Uint8Array);
        expect(result.resolution).toBe(64); // 2 stops = 64px
        expect(result.pixels.length).toBe(64 * 4);
    });

    it("test case - resolution adapts to stop count", () =>
    {
        // 5ストップのグラデーション
        const stops = [
            0, 1, 0, 0, 1,
            0.25, 1, 1, 0, 1,
            0.5, 0, 1, 0, 1,
            0.75, 0, 1, 1, 1,
            1, 0, 0, 1, 1
        ];

        const result = execute(stops, 0);

        expect(result.resolution).toBe(256); // 5 stops = 256px
    });

    it("test case - first pixel is start color", () =>
    {
        const stops = [
            0, 1, 0.5, 0.25, 1,   // ratio=0
            1, 0, 0, 1, 1         // ratio=1
        ];

        const result = execute(stops, 0);

        expect(result.pixels[0]).toBe(255);  // r
        expect(result.pixels[1]).toBe(128);  // g (0.5 * 255)
        expect(result.pixels[2]).toBe(64);   // b (0.25 * 255)
        expect(result.pixels[3]).toBe(255);  // a
    });

    it("test case - last pixel is end color", () =>
    {
        const stops = [
            0, 1, 0, 0, 1,
            1, 0.5, 0.25, 1, 0.5  // ratio=1
        ];

        const result = execute(stops, 0);

        const lastIndex = (result.resolution - 1) * 4;
        expect(result.pixels[lastIndex]).toBe(128);      // r (0.5 * 255)
        expect(result.pixels[lastIndex + 1]).toBe(64);   // g (0.25 * 255)
        expect(result.pixels[lastIndex + 2]).toBe(255);  // b
        expect(result.pixels[lastIndex + 3]).toBe(128);  // a (0.5 * 255)
    });

    it("test case - respects custom resolution limits", () =>
    {
        const stops = [
            0, 1, 0, 0, 1,
            1, 0, 0, 1, 1
        ];

        const result = execute(stops, 0, 128, 128);

        expect(result.resolution).toBe(128);
    });

    it("test case - handles unsorted stops", () =>
    {
        const stops = [
            1, 0, 0, 1, 1,   // ratio=1 (end)
            0, 1, 0, 0, 1    // ratio=0 (start)
        ];

        const result = execute(stops, 0);

        // 内部でソートされるので、最初のピクセルは赤になるはず
        expect(result.pixels[0]).toBe(255);  // r
        expect(result.pixels[1]).toBe(0);    // g
        expect(result.pixels[2]).toBe(0);    // b
    });
});
