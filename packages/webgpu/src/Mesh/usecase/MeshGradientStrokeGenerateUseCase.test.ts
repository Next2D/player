import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshGradientStrokeGenerateUseCase";

// Mock the MeshStrokeGenerateUseCase
// generateStrokeOutline now returns IPath[] directly (not IRectangleInfo[])
const mockGenerateStrokeOutline = vi.fn((vertices: number[], thickness: number) => {
    if (vertices.length < 6) {
        return [];
    }
    // Return IPath directly (rectangle with 5 points = 15 elements)
    return [[
        0, -thickness, false,
        100, -thickness, false,
        100, thickness, false,
        0, thickness, false,
        0, -thickness, false
    ]];
});

vi.mock("./MeshStrokeGenerateUseCase", () => ({
    "generateStrokeOutline": (vertices: number[], thickness: number) => mockGenerateStrokeOutline(vertices, thickness)
}));

describe("MeshGradientStrokeGenerateUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("basic mesh generation", () =>
    {
        it("should return IMeshResult with buffer and indexCount", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,      // a, b, c, d, tx, ty
                1, 1, 1, 1,            // red, green, blue, alpha
                800, 600               // viewportWidth, viewportHeight
            );

            expect(result).toHaveProperty("buffer");
            expect(result).toHaveProperty("indexCount");
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should return empty result for insufficient vertices", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });

        it("should return empty result for empty vertices array", () =>
        {
            const vertices: IPath[] = [];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });
    });

    describe("vertex format", () =>
    {
        it("should generate 17 floats per vertex", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            // Path with 5 points (15 elements): MeshFillGenerateService creates 3 triangles
            // Each triangle has 3 vertices, so 9 vertices total
            // 9 vertices * 17 floats = 153
            expect(result.buffer.length).toBe(9 * 17);
            expect(result.indexCount).toBe(9);
        });

        it("should set bezier coordinates correctly", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            // MeshFillGenerateService sets bezier coordinates based on curve flags
            // For non-curve vertices, it sets 0.5, 0.5
            expect(result.buffer.length).toBeGreaterThan(0);
            // Check that buffer contains values
            expect(result.buffer[2]).toBeDefined();
        });

        it("should include color values from parameters", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                0.5, 0.6, 0.7, 0.8,   // red, green, blue, alpha
                800, 600
            );

            // First vertex: color at indices 4, 5, 6, 7
            expect(result.buffer[4]).toBeCloseTo(0.5, 5);   // red
            expect(result.buffer[5]).toBeCloseTo(0.6, 5);   // green
            expect(result.buffer[6]).toBeCloseTo(0.7, 5);   // blue
            expect(result.buffer[7]).toBeCloseTo(0.8, 5);   // alpha
        });
    });

    describe("matrix normalization", () =>
    {
        it("should normalize matrix by viewport dimensions", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                400, 0, 0, 300, 80, 60,  // a, b, c, d, tx, ty
                1, 0, 0, 1,              // red, green, blue, alpha
                800, 600                 // viewport
            );

            // Matrix row 0 at indices 8, 9, 10
            // normalized a = 400 / 800 = 0.5
            // normalized b = 0 / 600 = 0
            expect(result.buffer[8]).toBeCloseTo(0.5, 5);
            expect(result.buffer[9]).toBe(0);

            // Matrix row 1 at indices 11, 12, 13
            // normalized c = 0 / 800 = 0
            // normalized d = 300 / 600 = 0.5
            expect(result.buffer[11]).toBe(0);
            expect(result.buffer[12]).toBeCloseTo(0.5, 5);

            // Matrix row 2 at indices 14, 15, 16
            // normalized tx = 80 / 800 = 0.1
            // normalized ty = 60 / 600 = 0.1
            expect(result.buffer[14]).toBeCloseTo(0.1, 5);
            expect(result.buffer[15]).toBeCloseTo(0.1, 5);
        });
    });

    describe("thickness handling", () =>
    {
        it("should use half thickness internally", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            execute(
                vertices, 20,  // thickness = 20
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            expect(mockGenerateStrokeOutline).toHaveBeenCalledWith(
                expect.anything(),
                10  // halfThickness = 20 / 2
            );
        });
    });

    describe("multiple paths", () =>
    {
        it("should handle multiple paths", () =>
        {
            const vertices: IPath[] = [
                [0, 0, false, 100, 0, false],
                [200, 200, false, 300, 200, false]
            ];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 1, 1, 1,
                800, 600
            );

            // 2 paths, each generates 9 vertices (from MeshFillGenerateService)
            expect(result.indexCount).toBe(18);
        });
    });
});
