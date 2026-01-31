import { execute } from "./ShaderManagerSetGradientFillUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $getViewportWidth: vi.fn(() => 800),
        $getViewportHeight: vi.fn(() => 600),
        $clamp: vi.fn((value, min, max, defaultValue) => {
            if (value < min) return min;
            if (value > max) return max;
            return value;
        })
    };
});

describe("ShaderManagerSetGradientFillUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set linear gradient fill uniform", () =>
    {
        const highp = new Float32Array(64);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const inverseMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const points = new Float32Array([0, 0, 100, 0]);

        execute(
            mockShaderManager,
            0,              // type = linear
            matrix,
            inverseMatrix,
            0,
            points
        );

        // Check viewport
        expect(highp[3]).toBe(800);
        expect(highp[7]).toBe(600);

        // Check linear points
        expect(highp[20]).toBe(0);
        expect(highp[21]).toBe(0);
        expect(highp[22]).toBe(100);
        expect(highp[23]).toBe(0);
    });

    it("test case - should set radial gradient fill uniform", () =>
    {
        const highp = new Float32Array(64);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const inverseMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        execute(
            mockShaderManager,
            1,              // type = radial
            matrix,
            inverseMatrix,
            0.5             // focal_point_ratio
        );

        // Check radial point
        expect(highp[20]).toBeCloseTo(819.2, 1);
    });

    it("test case - should handle focal point ratio", () =>
    {
        const highp = new Float32Array(64);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const inverseMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

        execute(
            mockShaderManager,
            1,
            matrix,
            inverseMatrix,
            0.5
        );

        // Should not throw
        expect(highp[20]).toBeCloseTo(819.2, 1);
    });

    it("test case - should set gradient fill uniform with grid data", () =>
    {
        const highp = new Float32Array(64);
        const mockShaderManager = {
            highp: highp
        } as unknown as ShaderManager;

        const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const inverseMatrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const gridData = new Float32Array([
            1, 0, 0, 1, 0, 0,           // parent matrix (0-5)
            1, 0, 0, 1, 0, 0,           // ancestor matrix (6-11)
            100, 100, 200, 200,         // parent viewport (12-15)
            10, 20, 30, 40,             // grid min (16-19)
            50, 60, 70, 80,             // grid max (20-23)
            5, 10                       // offset (24-25)
        ]);

        execute(
            mockShaderManager,
            1,
            matrix,
            inverseMatrix,
            0,
            null,
            gridData
        );

        // Check grid min (index 44-47 with grid data)
        expect(highp[44]).toBe(10);
        expect(highp[45]).toBe(20);

        // Check offset (index 52-53 with grid data)
        expect(highp[52]).toBe(5);
        expect(highp[53]).toBe(10);
    });
});
