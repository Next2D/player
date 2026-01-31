import { execute } from "./ShaderManagerSetBlendUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetBlendUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set blend uniform variables", () =>
    {
        const textures = new Int32Array(4);
        const mockShaderManager = {
            textures: textures
        } as unknown as ShaderManager;

        execute(mockShaderManager);

        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);
    });

    it("test case - should work with Float32Array textures", () =>
    {
        const textures = new Float32Array(4);
        const mockShaderManager = {
            textures: textures
        } as unknown as ShaderManager;

        execute(mockShaderManager);

        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);
    });
});
