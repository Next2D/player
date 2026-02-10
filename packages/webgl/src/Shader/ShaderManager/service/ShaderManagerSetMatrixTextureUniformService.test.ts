import { execute } from "./ShaderManagerSetMatrixTextureUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            $matrix: new Float32Array([1, 0, 0, 0, 1, 0, 10, 20, 1])
        },
        $viewportWidth: 800,
        $viewportHeight: 600
    };
});

describe("ShaderManagerSetMatrixTextureUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set matrix texture uniform variables", () =>
    {
        const highp = new Float32Array(16);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        execute(mockShaderManager, 100, 100);

        // Check matrix components
        expect(highp[0]).toBe(1);  // a
        expect(highp[1]).toBe(0);  // b
        expect(highp[2]).toBe(0);  // c
        expect(highp[3]).toBe(1);  // d
        expect(highp[4]).toBe(10); // tx
        expect(highp[5]).toBe(20); // ty

        // Check size
        expect(highp[6]).toBe(100); // width
        expect(highp[7]).toBe(100); // height

        // Check viewport
        expect(highp[8]).toBe(800); // viewport width
        expect(highp[9]).toBe(600); // viewport height
    });

    it("test case - should handle different dimensions", () =>
    {
        const highp = new Float32Array(16);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        execute(mockShaderManager, 256, 512);

        expect(highp[6]).toBe(256);
        expect(highp[7]).toBe(512);
    });
});
