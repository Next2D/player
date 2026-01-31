import { execute } from "./ShaderManagerSetMatrixTextureWithColorTransformUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            $matrix: new Float32Array([1, 0, 0, 0, 1, 0, 10, 20, 1])
        },
        $getViewportWidth: vi.fn(() => 800),
        $getViewportHeight: vi.fn(() => 600)
    };
});

describe("ShaderManagerSetMatrixTextureWithColorTransformUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set matrix texture with color transform uniform", () =>
    {
        const highp = new Float32Array(16);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            highp: highp,
            mediump: mediump
        } as unknown as ShaderManager;

        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        execute(mockShaderManager, colorTransform, 100, 100);

        // Check matrix components
        expect(highp[0]).toBe(1);  // a
        expect(highp[1]).toBe(0);  // b
        expect(highp[2]).toBe(0);  // c
        expect(highp[3]).toBe(1);  // d
        expect(highp[4]).toBe(10); // tx
        expect(highp[5]).toBe(20); // ty

        // Check size
        expect(highp[6]).toBe(100);
        expect(highp[7]).toBe(100);

        // Check viewport
        expect(highp[8]).toBe(800);
        expect(highp[9]).toBe(600);

        // Check color transform
        expect(mediump[0]).toBe(1);
        expect(mediump[1]).toBe(1);
        expect(mediump[2]).toBe(1);
        expect(mediump[3]).toBe(1);
        expect(mediump[4]).toBe(0);
        expect(mediump[5]).toBe(0);
        expect(mediump[6]).toBe(0);
        expect(mediump[7]).toBe(0);
    });

    it("test case - should handle tinted color transform", () =>
    {
        const highp = new Float32Array(16);
        const mediump = new Float32Array(16);
        const mockShaderManager = {
            highp: highp,
            mediump: mediump
        } as unknown as ShaderManager;

        const colorTransform = new Float32Array([0.5, 0.5, 0.5, 1, 0.5, 0, 0, 0]);

        execute(mockShaderManager, colorTransform, 200, 150);

        // Check color transform multiply
        expect(mediump[0]).toBe(0.5);
        expect(mediump[1]).toBe(0.5);
        expect(mediump[2]).toBe(0.5);
        expect(mediump[3]).toBe(1);

        // Check color transform add
        expect(mediump[4]).toBe(0.5);
        expect(mediump[5]).toBe(0);
        expect(mediump[6]).toBe(0);
        expect(mediump[7]).toBe(0);
    });
});
