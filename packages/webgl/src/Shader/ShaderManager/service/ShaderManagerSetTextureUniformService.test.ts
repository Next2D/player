import { execute } from "./ShaderManagerSetTextureUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            $matrix: new Float32Array([1, 0, 0, 1, 10, 20, 0, 0, 1])
        },
        $viewportWidth: 800,
        $viewportHeight: 600
    };
});

describe("ShaderManagerSetTextureUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set texture uniform variables", () =>
    {
        const highp = new Float32Array(16);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        execute(mockShaderManager, 100, 100);

        // Check size
        expect(highp[2]).toBe(100); // width
        expect(highp[3]).toBe(100); // height
        expect(highp[4]).toBe(800); // viewport width
        expect(highp[5]).toBe(600); // viewport height
    });

    it("test case - should handle different dimensions", () =>
    {
        const highp = new Float32Array(16);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        execute(mockShaderManager, 256, 512);

        expect(highp[2]).toBe(256);
        expect(highp[3]).toBe(512);
    });
});
