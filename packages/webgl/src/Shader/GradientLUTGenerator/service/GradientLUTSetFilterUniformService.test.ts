import { execute } from "./GradientLUTSetFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("GradientLUTSetFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set gradient filter uniform with single stop", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const ratios = new Float32Array([0, 255]);
        const colors = new Float32Array([0xFF0000, 0x0000FF]); // red to blue
        const alphas = new Float32Array([1, 1]);

        execute(mockShaderManager, ratios, colors, alphas, 0, 2);

        // Check first color (red)
        expect(mediump[0]).toBeCloseTo(1, 5);     // r
        expect(mediump[1]).toBeCloseTo(0, 5);     // g
        expect(mediump[2]).toBeCloseTo(0, 5);     // b
        expect(mediump[3]).toBe(1);               // a

        // Check second color (blue)
        expect(mediump[4]).toBeCloseTo(0, 5);     // r
        expect(mediump[5]).toBeCloseTo(0, 5);     // g
        expect(mediump[6]).toBeCloseTo(1, 5);     // b
        expect(mediump[7]).toBe(1);               // a

        // Check ratios (u_gradient_t)
        expect(mediump[8]).toBeCloseTo(0, 5);     // 0 / 255
        expect(mediump[9]).toBeCloseTo(1, 5);     // 255 / 255
    });

    it("test case - should handle partial range with begin and end", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const ratios = new Float32Array([0, 127, 255]);
        const colors = new Float32Array([0xFF0000, 0x00FF00, 0x0000FF]);
        const alphas = new Float32Array([1, 0.5, 0]);

        execute(mockShaderManager, ratios, colors, alphas, 1, 3);

        // Check first color in range (green at index 1)
        expect(mediump[0]).toBeCloseTo(0, 5);     // r
        expect(mediump[1]).toBeCloseTo(1, 5);     // g
        expect(mediump[2]).toBeCloseTo(0, 5);     // b
        expect(mediump[3]).toBe(0.5);             // a

        // Check second color in range (blue at index 2)
        expect(mediump[4]).toBeCloseTo(0, 5);     // r
        expect(mediump[5]).toBeCloseTo(0, 5);     // g
        expect(mediump[6]).toBeCloseTo(1, 5);     // b
        expect(mediump[7]).toBe(0);               // a
    });

    it("test case - should handle mixed colors correctly", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        // Mixed color: 0x80C0E0 = R:128, G:192, B:224
        const ratios = new Float32Array([128]);
        const colors = new Float32Array([0x80C0E0]);
        const alphas = new Float32Array([0.75]);

        execute(mockShaderManager, ratios, colors, alphas, 0, 1);

        expect(mediump[0]).toBeCloseTo(128 / 255, 5);  // r
        expect(mediump[1]).toBeCloseTo(192 / 255, 5);  // g
        expect(mediump[2]).toBeCloseTo(224 / 255, 5);  // b
        expect(mediump[3]).toBe(0.75);                  // a

        // Check ratio
        expect(mediump[4]).toBeCloseTo(128 / 255, 5);
    });
});
