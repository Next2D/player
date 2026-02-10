import { execute } from "./ShaderManagerSetConvolutionFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetConvolutionFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set convolution filter uniform with clamp", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const matrix = new Float32Array([
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ]);

        execute(
            mockShaderManager,
            100, 100,
            matrix,
            1,          // divisor
            0,          // bias
            true,       // clamp
            0, 0, 0, 0  // color
        );

        // Check rcp_size
        expect(mediump[0]).toBeCloseTo(1 / 100, 6);
        expect(mediump[1]).toBeCloseTo(1 / 100, 6);

        // Check rcp_divisor
        expect(mediump[2]).toBe(1);

        // Check bias
        expect(mediump[3]).toBe(0);
    });

    it("test case - should set convolution filter uniform without clamp", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const matrix = new Float32Array([
            -1, -1, -1,
            -1, 8, -1,
            -1, -1, -1
        ]);

        execute(
            mockShaderManager,
            200, 150,
            matrix,
            1,
            128,        // bias
            false,      // clamp
            1, 0, 0, 1  // substitute color (red)
        );

        // Check bias (128 / 255)
        expect(mediump[3]).toBeCloseTo(128 / 255, 6);

        // Check substitute color (index 4-7)
        expect(mediump[4]).toBe(1);  // r
        expect(mediump[5]).toBe(0);  // g
        expect(mediump[6]).toBe(0);  // b
        expect(mediump[7]).toBe(1);  // a

        // Matrix starts at index 8
        expect(mediump[8]).toBe(-1);
    });

    it("test case - should handle different divisors", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const matrix = new Float32Array([
            1, 1, 1,
            1, 1, 1,
            1, 1, 1
        ]);

        execute(
            mockShaderManager,
            100, 100,
            matrix,
            9,          // divisor for box blur
            0,
            true,
            0, 0, 0, 0
        );

        expect(mediump[2]).toBeCloseTo(1 / 9, 6);
    });
});
