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

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,      // a, b, c, d, tx, ty
                1, 0, 0, 1,            // red, green, blue, alpha
                800, 600               // viewportWidth, viewportHeight
            );

            expect(result).toHaveProperty("buffer");
            expect(result).toHaveProperty("indexCount");
            expect(result.buffer).toBeInstanceOf(Float32Array);
        });

        it("should generate 17 floats per vertex", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            // 2 triangles * 3 vertices = 6 vertices
            // 6 vertices * 17 floats = 102
            expect(result.buffer.length).toBe(6 * 17);
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

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            // Check bezier coordinates for all vertices
            for (let i = 0; i < result.indexCount; i++) {
                const offset = i * 17;
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

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            // All bezier coordinates should be (0.5, 0.5)
            for (let i = 0; i < result.indexCount; i++) {
                const offset = i * 17;
                expect(result.buffer[offset + 2]).toBe(0.5);
                expect(result.buffer[offset + 3]).toBe(0.5);
            }
        });
    });

    describe("matrix normalization", () =>
    {
        it("should normalize matrix by viewport dimensions", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(
                vertices,
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

    describe("color values", () =>
    {
        it("should include color values in output", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ]];

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                0.5, 0.6, 0.7, 0.8,  // red, green, blue, alpha
                800, 600
            );

            // First vertex: color at indices 4, 5, 6, 7
            expect(result.buffer[4]).toBeCloseTo(0.5, 5);   // red
            expect(result.buffer[5]).toBeCloseTo(0.6, 5);   // green
            expect(result.buffer[6]).toBeCloseTo(0.7, 5);   // blue
            expect(result.buffer[7]).toBeCloseTo(0.8, 5);   // alpha
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

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            // 2 paths * 2 triangles * 3 vertices = 12 vertices
            expect(result.indexCount).toBe(12);
        });
    });

    describe("empty input", () =>
    {
        it("should handle empty vertices array", () =>
        {
            const vertices: IPath[] = [];

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });

        it("should handle path with insufficient points", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = execute(
                vertices,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1,
                800, 600
            );

            expect(result.buffer.length).toBe(0);
            expect(result.indexCount).toBe(0);
        });
    });
});
