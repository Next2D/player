import { describe, it, expect } from "vitest";
import {
    getAdaptiveResolution,
    generateGradientLUT,
    generateFilterGradientLUT
} from "./GradientLUTGenerator";

describe("GradientLUTGenerator", () =>
{
    describe("getAdaptiveResolution", () =>
    {
        it("should return 256 for 1-4 stops", () =>
        {
            expect(getAdaptiveResolution(1)).toBe(256);
            expect(getAdaptiveResolution(2)).toBe(256);
            expect(getAdaptiveResolution(3)).toBe(256);
            expect(getAdaptiveResolution(4)).toBe(256);
        });

        it("should return 512 for 5-8 stops", () =>
        {
            expect(getAdaptiveResolution(5)).toBe(512);
            expect(getAdaptiveResolution(6)).toBe(512);
            expect(getAdaptiveResolution(7)).toBe(512);
            expect(getAdaptiveResolution(8)).toBe(512);
        });

        it("should return 1024 for 9+ stops", () =>
        {
            expect(getAdaptiveResolution(9)).toBe(1024);
            expect(getAdaptiveResolution(10)).toBe(1024);
            expect(getAdaptiveResolution(20)).toBe(1024);
        });
    });

    describe("generateGradientLUT", () =>
    {
        it("should generate correct size LUT", () =>
        {
            // 2 stops = 10 values (offset, R, G, B, A for each)
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255]; // red to blue
            const result = generateGradientLUT(stops, 0, 1);

            // 2 stops -> resolution 256, RGBA = 256 * 4
            expect(result.length).toBe(256 * 4);
        });

        it("should have correct start color", () =>
        {
            // Red at start, blue at end
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255];
            const result = generateGradientLUT(stops, 0, 1);

            // First pixel should be red
            expect(result[0]).toBe(255); // R
            expect(result[1]).toBe(0);   // G
            expect(result[2]).toBe(0);   // B
            expect(result[3]).toBe(255); // A
        });

        it("should have correct end color", () =>
        {
            // Red at start, blue at end
            const stops = [0, 255, 0, 0, 255, 1, 0, 0, 255, 255];
            const result = generateGradientLUT(stops, 0, 1);

            // Last pixel should be blue
            const lastOffset = (256 - 1) * 4;
            expect(result[lastOffset + 0]).toBe(0);   // R
            expect(result[lastOffset + 1]).toBe(0);   // G
            expect(result[lastOffset + 2]).toBe(255); // B
            expect(result[lastOffset + 3]).toBe(255); // A
        });

        it("should interpolate colors in RGB mode", () =>
        {
            // Black at start, white at end
            const stops = [0, 0, 0, 0, 255, 1, 255, 255, 255, 255];
            const result = generateGradientLUT(stops, 0, 1); // RGB mode

            // Middle pixel should be around 127-128
            const midOffset = 128 * 4;
            expect(result[midOffset]).toBeGreaterThan(120);
            expect(result[midOffset]).toBeLessThan(135);
        });

        it("should handle single stop", () =>
        {
            // Single red stop
            const stops = [0.5, 255, 0, 0, 255];
            const result = generateGradientLUT(stops, 0, 1);

            expect(result.length).toBe(256 * 4);
            // Should be all red
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
        });

        it("should handle three stops", () =>
        {
            // Red -> Green -> Blue
            const stops = [
                0, 255, 0, 0, 255,     // Red at 0
                0.5, 0, 255, 0, 255,   // Green at 0.5
                1, 0, 0, 255, 255      // Blue at 1
            ];
            const result = generateGradientLUT(stops, 0, 1);

            // Start should be red
            expect(result[0]).toBe(255);
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);

            // End should be blue
            const lastOffset = (256 - 1) * 4;
            expect(result[lastOffset]).toBe(0);
            expect(result[lastOffset + 1]).toBe(0);
            expect(result[lastOffset + 2]).toBe(255);
        });
    });

    describe("generateFilterGradientLUT", () =>
    {
        it("should generate 256x4 bytes LUT", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]); // Red, Blue
            const alphas = new Float32Array([1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            expect(result.length).toBe(256 * 4);
        });

        it("should have correct start color with alpha", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]); // Red, Blue
            const alphas = new Float32Array([1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // First pixel: red with full alpha (premultiplied)
            expect(result[0]).toBe(255); // R * A
            expect(result[1]).toBe(0);   // G * A
            expect(result[2]).toBe(0);   // B * A
            expect(result[3]).toBe(255); // A
        });

        it("should apply premultiplied alpha", () =>
        {
            const ratios = new Float32Array([0, 255]);
            const colors = new Float32Array([0xFF0000, 0xFF0000]); // Red
            const alphas = new Float32Array([0.5, 0.5]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // Red with 0.5 alpha (premultiplied)
            expect(result[0]).toBe(128); // R * 0.5 = 127.5 -> 128
            expect(result[1]).toBe(0);
            expect(result[2]).toBe(0);
            expect(result[3]).toBe(128); // A * 255 = 127.5 -> 128
        });

        it("should interpolate between stops", () =>
        {
            const ratios = new Float32Array([0, 128, 255]);
            const colors = new Float32Array([0xFF0000, 0x00FF00, 0x0000FF]);
            const alphas = new Float32Array([1, 1, 1]);

            const result = generateFilterGradientLUT(ratios, colors, alphas);

            // Should have different colors at different positions
            expect(result[0]).toBe(255); // Red at start
            expect(result[255 * 4 + 2]).toBe(255); // Blue at end
        });
    });
});
