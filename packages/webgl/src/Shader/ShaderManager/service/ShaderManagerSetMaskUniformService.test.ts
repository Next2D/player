import { execute } from "./ShaderManagerSetMaskUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $viewportWidth: 800,
        $viewportHeight: 600
    };
});

describe("ShaderManagerSetMaskUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set mask uniform variables", () =>
    {
        const highp = new Float32Array(40);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const gridData = new Float32Array([
            1, 0, 0, 1, 0, 0,           // parent matrix (0-5)
            2, 0, 0, 2, 0, 0,           // ancestor matrix (6-11)
            100, 100, 200, 200,         // parent viewport (12-15)
            10, 20, 30, 40,             // grid min (16-19)
            50, 60, 70, 80,             // grid max (20-23)
            15, 25                      // offset (24-25)
        ]);

        execute(mockShaderManager, gridData);

        // Check parent matrix
        expect(highp[0]).toBe(1);
        expect(highp[1]).toBe(0);
        expect(highp[4]).toBe(0);
        expect(highp[5]).toBe(1);

        // Check ancestor matrix
        expect(highp[12]).toBe(2);
        expect(highp[13]).toBe(0);
        expect(highp[16]).toBe(0);
        expect(highp[17]).toBe(2);

        // Check viewport
        expect(highp[3]).toBe(800);
        expect(highp[7]).toBe(600);

        // Check offset
        expect(highp[32]).toBe(15);
        expect(highp[33]).toBe(25);
    });
});
