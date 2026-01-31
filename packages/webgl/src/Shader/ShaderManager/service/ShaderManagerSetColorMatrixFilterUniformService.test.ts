import { execute } from "./ShaderManagerSetColorMatrixFilterUniformService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ShaderManager } from "../../ShaderManager";

describe("ShaderManagerSetColorMatrixFilterUniformService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should set color matrix filter uniform with identity matrix", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const identityMatrix = new Float32Array([
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ]);

        execute(mockShaderManager, identityMatrix);

        // Check u_mul matrix
        expect(mediump[0]).toBe(1);  // matrix[0]
        expect(mediump[5]).toBe(1);  // matrix[6]
        expect(mediump[10]).toBe(1); // matrix[12]
        expect(mediump[15]).toBe(1); // matrix[18]

        // Check u_add (all zeros for identity)
        expect(mediump[16]).toBe(0);
        expect(mediump[17]).toBe(0);
        expect(mediump[18]).toBe(0);
        expect(mediump[19]).toBe(0);
    });

    it("test case - should set color matrix filter uniform with grayscale matrix", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const grayscaleMatrix = new Float32Array([
            0.3, 0.3, 0.3, 0, 0,
            0.59, 0.59, 0.59, 0, 0,
            0.11, 0.11, 0.11, 0, 0,
            0, 0, 0, 1, 0
        ]);

        execute(mockShaderManager, grayscaleMatrix);

        expect(mediump[0]).toBeCloseTo(0.3, 5);
    });

    it("test case - should set color matrix filter uniform with brightness adjustment", () =>
    {
        const mediump = new Float32Array(24);
        const mockShaderManager = {
            mediump: mediump
        } as unknown as ShaderManager;

        const brightnessMatrix = new Float32Array([
            1, 0, 0, 0, 50,
            0, 1, 0, 0, 50,
            0, 0, 1, 0, 50,
            0, 0, 0, 1, 0
        ]);

        execute(mockShaderManager, brightnessMatrix);

        // Check u_add values (divided by 255)
        expect(mediump[16]).toBeCloseTo(50 / 255, 6);
        expect(mediump[17]).toBeCloseTo(50 / 255, 6);
        expect(mediump[18]).toBeCloseTo(50 / 255, 6);
    });
});
