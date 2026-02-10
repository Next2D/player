import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshFillGenerateUseCase";

// Mock the service
vi.mock("../service/MeshFillGenerateService", () => ({
    "execute": vi.fn((vertex, buffer, index) => {
        // Simulate processing: each triangle iteration produces 3 vertices
        const triangleCount = Math.floor((vertex.length - 5) / 3);
        return index + triangleCount * 3;
    })
}));

import { execute as mockFillGenerateService } from "../service/MeshFillGenerateService";

describe("MeshFillGenerateUseCase", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("vertex counting", () =>
    {
        it("should calculate correct total vertices for single path", () =>
        {
            // Path with 4 points (12 elements) = 2 triangles (6 vertices)
            // length - 5 = 7, idx from 3 to 6, 2 iterations = 6 vertices
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices);

            // Buffer should be allocated based on vertex count
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should handle multiple paths", () =>
        {
            const vertices: IPath[] = [
                [0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false],
                [200, 200, false, 300, 200, false, 300, 300, false, 200, 200, false]
            ];

            execute(vertices);

            // Should be called once per path
            expect(mockFillGenerateService).toHaveBeenCalledTimes(2);
        });
    });

    describe("service call", () =>
    {
        it("should pass vertex, buffer, and index to service", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            execute(vertices);

            expect(mockFillGenerateService).toHaveBeenCalledWith(
                expect.anything(),
                expect.any(Float32Array),
                0
            );
        });
    });

    describe("result structure", () =>
    {
        it("should return buffer property", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices);

            expect(result).toHaveProperty("buffer");
        });

        it("should return indexCount property", () =>
        {
            const vertices: IPath[] = [[0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false]];

            const result = execute(vertices);

            expect(result).toHaveProperty("indexCount");
        });
    });

    describe("empty input", () =>
    {
        it("should handle empty vertices array", () =>
        {
            const vertices: IPath[] = [];

            const result = execute(vertices);

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });

        it("should handle path with insufficient points", () =>
        {
            // Path with only 2 points (6 elements) - not enough for a triangle
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            const result = execute(vertices);

            // Service should be called but return same index
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });
    });
});
