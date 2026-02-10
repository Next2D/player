import { execute } from "./GradientLUTSetUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("GradientLUTSetUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set gradient uniform from stops", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        // stops format: [ratio, r_idx, g_idx, b_idx, a_idx, ...]
        const stops = [
            0, 0, 1, 2, 3,    // first stop
            255, 4, 5, 6, 7   // second stop
        ];

        // table with color values
        const table = new Float32Array([
            1, 0, 0, 1,       // RGBA at indices 0-3
            0, 0, 1, 0.5      // RGBA at indices 4-7
        ]);

        execute(mockShaderManager, stops, 0, 2, table);

        // Check first color (from table indices 0,1,2,3)
        expect(mediump[0]).toBe(1);   // table[0]
        expect(mediump[1]).toBe(0);   // table[1]
        expect(mediump[2]).toBe(0);   // table[2]
        expect(mediump[3]).toBe(1);   // table[3]

        // Check second color (from table indices 4,5,6,7)
        expect(mediump[4]).toBe(0);   // table[4]
        expect(mediump[5]).toBe(0);   // table[5]
        expect(mediump[6]).toBe(1);   // table[6]
        expect(mediump[7]).toBe(0.5); // table[7]

        // Check ratios (u_gradient_t)
        expect(mediump[8]).toBe(0);   // stops[0]
        expect(mediump[9]).toBe(255); // stops[5]
    });

    it("test case - should handle partial range", () =>
    {
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const stops = [
            0, 0, 1, 2, 3,
            127, 4, 5, 6, 7,
            255, 8, 9, 10, 11
        ];

        const table = new Float32Array([
            1, 0, 0, 1,
            0, 1, 0, 1,
            0, 0, 1, 1
        ]);

        execute(mockShaderManager, stops, 1, 3, table);

        // First color in range should be from stops[1]
        expect(mediump[0]).toBe(0);   // table[4]
        expect(mediump[1]).toBe(1);   // table[5]
        expect(mediump[2]).toBe(0);   // table[6]
        expect(mediump[3]).toBe(1);   // table[7]

        // Check ratios
        expect(mediump[8]).toBe(127); // stops[5] (second stop ratio)
        expect(mediump[9]).toBe(255); // stops[10] (third stop ratio)
    });

    it("test case - should process single stop", () =>
    {
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const stops = [128, 0, 1, 2, 3];
        const table = new Float32Array([0.5, 0.6, 0.7, 0.8]);

        execute(mockShaderManager, stops, 0, 1, table);

        expect(mediump[0]).toBeCloseTo(0.5, 5);
        expect(mediump[1]).toBeCloseTo(0.6, 5);
        expect(mediump[2]).toBeCloseTo(0.7, 5);
        expect(mediump[3]).toBeCloseTo(0.8, 5);
        expect(mediump[4]).toBe(128);  // ratio
    });
});
