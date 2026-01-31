import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshGradientStrokeGenerateUseCase";

// Mock the MeshStrokeGenerateUseCase
const mockGenerateStrokeOutline = vi.fn((vertices: number[], thickness: number) => {
    if (vertices.length < 6) {
        return [];
    }
    return [{
        "path": [
            0, -thickness, false,
            100, -thickness, false,
            100, thickness, false,
            0, thickness, false,
            0, -thickness, false
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
                1, 1, 1, 1,
                800, 600
            );

            // First vertex: bezier at indices 2, 3
            expect(result.buffer[2]).toBe(0.5);
            expect(result.buffer[3]).toBe(0.5);
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

            // 2 paths = 2 rectangles = 12 vertices
            expect(result.indexCount).toBe(12);
        });
    });
});
