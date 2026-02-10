import { execute } from "./ShaderManagerSetBitmapFillUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            $matrix: new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
            $stack: [new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])]
        },
        $inverseMatrix: vi.fn(() => new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])),
        $viewportWidth: 800,
        $viewportHeight: 600
    };
});

describe("ShaderManagerSetBitmapFillUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set bitmap fill uniform without grid data", () =>
    {
        const highp = new Float32Array(64);
        const mediump = new Float32Array(8);
        const mockShaderManager = {
            highp: highp,
            mediump: mediump
        } as unknown as ShaderManager;

        execute(mockShaderManager, 100, 100, null);

        // Check viewport
        expect(highp[3]).toBe(800);
        expect(highp[7]).toBe(600);

        // Check uv
        expect(mediump[0]).toBe(100);
        expect(mediump[1]).toBe(100);
    });

    it("test case - should set bitmap fill uniform with grid data", () =>
    {
        const highp = new Float32Array(64);
        const mediump = new Float32Array(8);
        const mockShaderManager = {
            highp: highp,
            mediump: mediump
        } as unknown as ShaderManager;

        const gridData = new Float32Array([
            1, 0, 0, 1, 0, 0,           // parent matrix (0-5)
            1, 0, 0, 1, 0, 0,           // ancestor matrix (6-11)
            100, 100, 200, 200,         // parent viewport (12-15)
            10, 20, 30, 40,             // grid min (16-19)
            50, 60, 70, 80,             // grid max (20-23)
            5, 10                       // offset (24-25)
        ]);

        execute(mockShaderManager, 200, 150, gridData);

        // Check grid min
        expect(highp[44]).toBe(10);
        expect(highp[45]).toBe(20);

        // Check grid max
        expect(highp[48]).toBe(50);
        expect(highp[49]).toBe(60);

        // Check offset
        expect(highp[52]).toBe(5);
        expect(highp[53]).toBe(10);

        // Check uv
        expect(mediump[0]).toBe(200);
        expect(mediump[1]).toBe(150);
    });
});
