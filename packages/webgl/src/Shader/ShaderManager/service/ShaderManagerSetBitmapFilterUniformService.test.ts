import { execute } from "./ShaderManagerSetBitmapFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetBitmapFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set bitmap filter uniform for glow filter", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            130, 130,       // width, height
            100, 100,       // base_width, base_height
            10, 10,         // base_offset_x, base_offset_y
            120, 120,       // blur_width, blur_height
            0, 0,           // blur_offset_x, blur_offset_y
            true,           // is_glow
            1,              // strength
            1, 0, 0, 1,     // color1 (red)
            0, 0, 0, 0,     // color2
            true,           // transforms_base
            true,           // transforms_blur
            false,          // applies_strength
            false           // is_gradient
        );

        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);
    });

    it("test case - should set bitmap filter uniform for bevel filter", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(32);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            130, 130,
            100, 100,
            15, 15,
            120, 120,
            5, 5,
            false,          // is_glow (bevel)
            1,
            1, 1, 1, 1,     // highlight color (white)
            0, 0, 0, 1,     // shadow color (black)
            true,
            true,
            false,
            false
        );

        // Verify textures are set
        expect(textures[0]).toBe(0);
        expect(textures[1]).toBe(1);
    });

    it("test case - should set bitmap filter uniform with gradient", () =>
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
            100, 100,
            0, 0,
            100, 100,
            0, 0,
            true,
            1,
            0, 0, 0, 0,
            0, 0, 0, 0,
            true,
            false,
            false,
            true            // is_gradient
        );

        expect(textures[2]).toBe(2);
    });

    it("test case - should set bitmap filter uniform with strength", () =>
    {
        const textures = new Int32Array(4);
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            textures: textures,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(
            mockShaderManager,
            100, 100,
            100, 100,
            0, 0,
            100, 100,
            0, 0,
            true,
            2.5,            // strength
            1, 0, 0, 1,
            0, 0, 0, 0,
            false,
            false,
            true,           // applies_strength
            false
        );

        // Last value should be strength
        expect(mediump[4]).toBe(2.5);
    });
});
