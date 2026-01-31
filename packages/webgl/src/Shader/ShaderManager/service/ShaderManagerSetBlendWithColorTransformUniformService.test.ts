import { execute } from "./ShaderManagerSetBlendWithColorTransformUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetBlendWithColorTransformUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set blend with color transform uniform", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            1, 1, 1, 1,     // color transform multiply
            0, 0, 0, 0      // color transform add
        );

        // Check textures
        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);

        // Check color transform multiply
        expect(mediump[0]).toBe(1);
        expect(mediump[1]).toBe(1);
        expect(mediump[2]).toBe(1);
        expect(mediump[3]).toBe(1);

        // Check color transform add
        expect(mediump[4]).toBe(0);
        expect(mediump[5]).toBe(0);
        expect(mediump[6]).toBe(0);
        expect(mediump[7]).toBe(0);
    });

    it("test case - should set blend with tint color transform", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            0.5, 0.5, 0.5, 1,   // multiply by 50%
            0.5, 0, 0, 0        // add red tint
        );

        expect(mediump[0]).toBe(0.5);
        expect(mediump[4]).toBe(0.5);
    });
});
