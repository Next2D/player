import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshFillGenerateUseCase";

// Mock the service
vi.mock("../service/MeshFillGenerateService", () => ({
    "execute": vi.fn((vertex, buffer, index, a, b, c, d, tx, ty, r, g, b_, alpha) => {
        // Simulate processing: add 17 floats per triangle vertex
        // For simplicity, assume each vertex contributes some data
        const triangleCount = Math.floor((vertex.length - 5) / 3);
        return index + triangleCount * 3 * 17;
    })
}));

import { execute as mockFillGenerateService } from "../service/MeshFillGenerateService";

describe("MeshFillGenerateUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("matrix normalization", () =>
    {
        it("should normalize matrix by viewport width", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            execute(vertices, 2, 0, 0, 2, 10, 20, 1, 1, 1, 1, 200, 100);

            expect(mockFillGenerateService).toHaveBeenCalledWith(
                expect.anything(),
                expect.any(Float32Array),
                0,
                0.01, // 2 / 200
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                0.05, // 10 / 200
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number)
            );
        });

        it("should normalize matrix by viewport height", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            execute(vertices, 2, 4, 6, 8, 10, 20, 1, 1, 1, 1, 200, 100);

            expect(mockFillGenerateService).toHaveBeenCalledWith(
                expect.anything(),
                expect.any(Float32Array),
                0,
                expect.any(Number),
                0.04, // 4 / 100
                expect.any(Number),
                0.08, // 8 / 100
                expect.any(Number),
                0.2,  // 20 / 100
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number)
            );
        });
    });

    describe("vertex counting", () =>
    {
        it("should calculate correct total vertices for single path", () =>
        {
            // Path with 4 points (12 elements) = 1 triangle (3 vertices)
            // length - 5 = 7, idx from 3 to 6, 1 iteration = 3 vertices
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            // Buffer should be allocated based on vertex count
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should handle multiple paths", () =>
        {
            const vertices: IPath[] = [
                [0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false],
                [200, 200, false, 300, 200, false, 300, 300, false, 200, 200, false]
            ];

            execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            // Should be called once per path
            expect(mockFillGenerateService).toHaveBeenCalledTimes(2);
        });
    });

    describe("color passing", () =>
    {
        it("should pass color values to service", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            execute(vertices, 1, 0, 0, 1, 0, 0, 0.5, 0.6, 0.7, 0.8, 100, 100);

            expect(mockFillGenerateService).toHaveBeenCalledWith(
                expect.anything(),
                expect.any(Float32Array),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                expect.any(Number),
                0.5, // red
                0.6, // green
                0.7, // blue
                0.8  // alpha
            );
        });
    });

    describe("result structure", () =>
    {
        it("should return buffer property", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            expect(result).toHaveProperty("buffer");
        });

        it("should return indexCount property", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            expect(result).toHaveProperty("indexCount");
        });
    });

    describe("empty input", () =>
    {
        it("should handle empty vertices array", () =>
        {
            const vertices: IPath[] = [];

            const result = execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });

        it("should handle path with insufficient points", () =>
        {
            // Path with only 2 points (6 elements) - not enough for a triangle
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            const result = execute(vertices, 1, 0, 0, 1, 0, 0, 1, 1, 1, 1, 100, 100);

            // Service should be called but return same index
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });
    });
});
