import { execute } from "./ShaderManagerSetDisplacementMapFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetDisplacementMapFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set displacement map filter uniform", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            100, 100,       // map size
            200, 200,       // base size
            0, 0,           // point
            10, 10,         // scale
            0,              // mode (wrap)
            0, 0, 0, 0      // color
        );

        // Check textures
        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);

        // Check uv_to_st_scale
        expect(mediump[0]).toBe(2);
        expect(mediump[1]).toBe(2);
    });

    it("test case - should set displacement map filter uniform with color mode", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            50, 50,
            100, 100,
            10, 10,
            20, 20,
            1,              // mode (color)
            1, 0, 0, 1      // substitute color (red)
        );

        // Check substitute color
        expect(mediump[8]).toBe(1);   // r
        expect(mediump[9]).toBe(0);   // g
        expect(mediump[10]).toBe(0);  // b
        expect(mediump[11]).toBe(1);  // a
    });

    it("test case - should handle point offset", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            100, 100,
            200, 200,
            50, 50,         // point offset
            10, 10,
            0,
            0, 0, 0, 0
        );

        // Check uv_to_st_offset
        expect(mediump[2]).toBe(50 / 100);
        expect(mediump[3]).toBe((200 - 100 - 50) / 100);
    });
});
