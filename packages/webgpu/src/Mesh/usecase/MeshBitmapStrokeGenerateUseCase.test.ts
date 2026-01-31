import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshBitmapStrokeGenerateUseCase";

// Mock the MeshStrokeGenerateUseCase
const mockGenerateStrokeOutline = vi.fn((vertices: number[], thickness: number) => {
    if (vertices.length < 6) {
        return [];
    }
    // Return mock rectangle info for a simple line segment
    return [{
        "path": [
            0, -thickness, false,   // p0
            100, -thickness, false, // p1
            100, thickness, false,  // p2
            0, thickness, false,    // p3
            0, -thickness, false    // close
        ],
        "startUp": { "x": 0, "y": -thickness },
        "startDown": { "x": 0, "y": thickness },
        "endUp": { "x": 100, "y": -thickness },
        "endDown": { "x": 100, "y": thickness }
    }];
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

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,      // a, b, c, d, tx, ty
                1, 0, 0, 1,            // red, green, blue, alpha
                800, 600               // viewportWidth, viewportHeight
            );

            expect(result).toHaveProperty("buffer");
            expect(result).toHaveProperty("indexCount");
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should return empty result for insufficient vertices", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false // Only one point
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
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
                1, 0, 0, 1,
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
                1, 0, 0, 1,
                800, 600
            );

            // 1 rectangle = 2 triangles = 6 vertices
            // 6 vertices * 17 floats = 102
            expect(result.buffer.length).toBe(6 * 17);
            expect(result.indexCount).toBe(6);
        });

        it("should set bezier coordinates to 0.5", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            // First vertex: bezier at indices 2, 3
            expect(result.buffer[2]).toBe(0.5);
            expect(result.buffer[3]).toBe(0.5);
        });

        it("should include color values", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices, 10,
                1, 0, 0, 1, 0, 0,
                0.5, 0.6, 0.7, 0.8,  // red, green, blue, alpha
                800, 600
            );

            // First vertex: color at indices 4, 5, 6, 7
            // Use toBeCloseTo for Float32Array precision
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
                800, 0, 0, 600, 100, 50,  // a, b, c, d, tx, ty
                1, 0, 0, 1,
                800, 600  // viewport
            );

            // Matrix row 0 at indices 8, 9, 10
            // normalized a = 800 / 800 = 1
            expect(result.buffer[8]).toBe(1);

            // Matrix row 1 at indices 11, 12, 13
            // normalized d = 600 / 600 = 1
            expect(result.buffer[11]).toBe(0); // c / viewportWidth
            expect(result.buffer[12]).toBe(1); // d / viewportHeight

            // Matrix row 2 at indices 14, 15, 16
            // normalized tx = 100 / 800 = 0.125
            // normalized ty = 50 / 600 = 0.0833...
            expect(result.buffer[14]).toBeCloseTo(0.125, 5);
            expect(result.buffer[15]).toBeCloseTo(50 / 600, 5);
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
                1, 0, 0, 1,
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
                1, 0, 0, 1,
                800, 600
            );

            // 2 paths * 1 rectangle each * 2 triangles * 6 vertices = 12 vertices
            // But actually 2 paths = 2 rectangles = 12 vertices * 17 floats = 204
            expect(result.indexCount).toBe(12);
        });
    });
});
