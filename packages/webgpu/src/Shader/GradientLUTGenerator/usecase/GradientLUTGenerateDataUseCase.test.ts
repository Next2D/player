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

    it("test case - white gradient with varying alpha (0xffffff alpha 1.0 to 0.6)", () =>
    {
        // Issue: 0xffffff (white) colors and transparency/alpha gradients were not displaying
        const stops = [
            0, 1, 1, 1, 1,     // ratio=0, white with alpha=1.0
            1, 1, 1, 1, 0.6    // ratio=1, white with alpha=0.6
        ];

        const result = execute(stops, 0);

        // First pixel: white with full alpha
        expect(result.pixels[0]).toBe(255);  // r
        expect(result.pixels[1]).toBe(255);  // g
        expect(result.pixels[2]).toBe(255);  // b
        expect(result.pixels[3]).toBe(255);  // a (1.0)

        // Last pixel: white with 60% alpha
        const lastIndex = (result.resolution - 1) * 4;
        expect(result.pixels[lastIndex]).toBe(255);      // r
        expect(result.pixels[lastIndex + 1]).toBe(255);  // g
        expect(result.pixels[lastIndex + 2]).toBe(255);  // b
        expect(result.pixels[lastIndex + 3]).toBe(153);  // a (0.6 * 255 = 153)
    });

    it("test case - alpha-only gradient (same color, different alphas)", () =>
    {
        const stops = [
            0, 0.8, 0.4, 0.2, 1,    // ratio=0, color with alpha=1.0
            1, 0.8, 0.4, 0.2, 0     // ratio=1, same color with alpha=0.0
        ];

        const result = execute(stops, 0);

        // First pixel: full alpha
        expect(result.pixels[3]).toBe(255);  // a (1.0)

        // Last pixel: zero alpha (fully transparent)
        const lastIndex = (result.resolution - 1) * 4;
        expect(result.pixels[lastIndex + 3]).toBe(0);  // a (0.0)

        // Middle pixel should have ~50% alpha
        const midIndex = Math.floor(result.resolution / 2) * 4;
        expect(result.pixels[midIndex + 3]).toBeGreaterThan(100);
        expect(result.pixels[midIndex + 3]).toBeLessThan(156);
    });
});
