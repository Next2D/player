import { execute } from "./ShaderManagerSetFillUniformService";
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

describe("ShaderManagerSetFillUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set fill uniform variables", () =>
    {
        const highp = new Float32Array(40);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const gridData = new Float32Array([
            1, 0, 0, 1, 0, 0,           // parent matrix (0-5)
            1, 0, 0, 1, 0, 0,           // ancestor matrix (6-11)
            100, 100, 200, 200,         // parent viewport (12-15)
            10, 20, 30, 40,             // grid min (16-19)
            50, 60, 70, 80,             // grid max (20-23)
            5, 10                       // offset (24-25)
        ]);

        execute(mockShaderManager, gridData);

        // Check parent matrix
        expect(highp[0]).toBe(1);
        expect(highp[1]).toBe(0);
        expect(highp[4]).toBe(0);
        expect(highp[5]).toBe(1);
        expect(highp[8]).toBe(0);
        expect(highp[9]).toBe(0);

        // Check viewport
        expect(highp[3]).toBe(800);
        expect(highp[7]).toBe(600);

        // Check grid min
        expect(highp[24]).toBe(10);
        expect(highp[25]).toBe(20);
        expect(highp[26]).toBe(30);
        expect(highp[27]).toBe(40);

        // Check grid max
        expect(highp[28]).toBe(50);
        expect(highp[29]).toBe(60);
        expect(highp[30]).toBe(70);
        expect(highp[31]).toBe(80);

        // Check offset
        expect(highp[32]).toBe(5);
        expect(highp[33]).toBe(10);
    });
});
