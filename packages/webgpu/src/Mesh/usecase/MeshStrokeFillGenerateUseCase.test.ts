import { describe, it, expect } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshStrokeFillGenerateUseCase";

describe("MeshStrokeFillGenerateUseCase", () =>
{
    describe("basic mesh generation", () =>
    {
        it("should return IMeshResult with buffer and indexCount", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(vertices);

            expect(result).toHaveProperty("buffer");
            expect(result).toHaveProperty("indexCount");
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should generate 4 floats per vertex", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(vertices);

            // 2 triangles * 3 vertices = 6 vertices
            // 6 vertices * 4 floats = 24
            expect(result.buffer.length).toBe(6 * 4);
            expect(result.indexCount).toBe(6);
        });
    });

    describe("bezier coordinates", () =>
    {
        it("should always set bezier to (0.5, 0.5) for stroke fill", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(vertices);

            // Check bezier coordinates for all vertices
            for (let i = 0; i < result.indexCount; i++) {
                const offset = i * 4;
                expect(result.buffer[offset + 2]).toBe(0.5);  // bezier.u
                expect(result.buffer[offset + 3]).toBe(0.5);  // bezier.v
            }
        });

        it("should set bezier to (0.5, 0.5) even for curve paths", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                50, 50, true,   // control point
                100, 0, false,
                0, 0, false
            ]];

            const result = execute(vertices);

            // All bezier coordinates should be (0.5, 0.5)
            for (let i = 0; i < result.indexCount; i++) {
                const offset = i * 4;
                expect(result.buffer[offset + 2]).toBe(0.5);
                expect(result.buffer[offset + 3]).toBe(0.5);
            }
        });
    });

    describe("multiple paths", () =>
    {
        it("should handle multiple paths", () =>
        {
            const vertices: IPath[] = [
                [0, 0, false, 100, 0, false, 100, 100, false, 0, 0, false],
                [200, 200, false, 300, 200, false, 300, 300, false, 200, 200, false]
            ];

            const result = execute(vertices);

            // 2 paths * 2 triangles * 3 vertices = 12 vertices
            expect(result.indexCount).toBe(12);
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
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(vertices);

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });
    });
});
