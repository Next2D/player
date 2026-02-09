import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshBitmapStrokeGenerateUseCase";

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

describe("MeshBitmapStrokeGenerateUseCase", () =>
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

            const result = execute(vertices, 10);

            expect(result).toHaveProperty("buffer");
            expect(result).toHaveProperty("indexCount");
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should return empty result for insufficient vertices", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false // Only one point
            ]];

            const result = execute(vertices, 10);

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });

        it("should return empty result for empty vertices array", () =>
        {
            const vertices: IPath[] = [];

            const result = execute(vertices, 10);

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });
    });

    describe("vertex format", () =>
    {
        it("should generate 4 floats per vertex", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(vertices, 10);

            // Path with 5 points (15 elements): MeshStrokeFillGenerateService creates 3 triangles
            // Each triangle has 3 vertices, so 9 vertices total
            // 9 vertices * 4 floats = 36
            expect(result.buffer.length).toBe(9 * 4);
            expect(result.indexCount).toBe(9);
        });

        it("should set bezier coordinates correctly", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(vertices, 10);

            // MeshStrokeFillGenerateService sets bezier coordinates to (0.5, 0.5)
            expect(result.buffer.length).toBeGreaterThan(0);
            // Check bezier at offset 2
            expect(result.buffer[2]).toBe(0.5);
            expect(result.buffer[3]).toBe(0.5);
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

            execute(vertices, 20);  // thickness = 20

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

            const result = execute(vertices, 10);

            // 2 paths, each generates 9 vertices (from MeshStrokeFillGenerateService)
            expect(result.indexCount).toBe(18);
        });
    });
});
