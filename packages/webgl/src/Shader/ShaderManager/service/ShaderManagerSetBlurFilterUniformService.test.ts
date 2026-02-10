import { execute } from "./ShaderManagerSetBlurFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetBlurFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set horizontal blur filter uniform", () =>
    {
        const mediump = new Float32Array(8);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        execute(mockShaderManager, 100, 100, true, 0.5, 8);

        expect(mediump[0]).toBeCloseTo(1 / 100, 6);  // u_offset.x
        expect(mediump[1]).toBe(0);        // u_offset.y
        expect(mediump[2]).toBe(0.5);      // u_fraction
        expect(mediump[3]).toBe(8);        // u_samples
    });

    it("test case - should set vertical blur filter uniform", () =>
    {
        const mediump = new Float32Array(8);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        execute(mockShaderManager, 100, 200, false, 0.75, 16);

        expect(mediump[0]).toBe(0);          // u_offset.x
        expect(mediump[1]).toBeCloseTo(1 / 200, 6);    // u_offset.y
        expect(mediump[2]).toBe(0.75);       // u_fraction
        expect(mediump[3]).toBe(16);         // u_samples
    });

    it("test case - should handle different texture sizes", () =>
    {
        const mediump = new Float32Array(8);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        execute(mockShaderManager, 512, 256, true, 1, 32);

        expect(mediump[0]).toBeCloseTo(1 / 512, 6);
        expect(mediump[1]).toBe(0);
        expect(mediump[2]).toBe(1);
        expect(mediump[3]).toBe(32);
    });
});
