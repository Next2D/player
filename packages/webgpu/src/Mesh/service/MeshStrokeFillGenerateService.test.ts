import { describe, it, expect } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshStrokeFillGenerateService";

describe("MeshStrokeFillGenerateService", () =>
{
    const FLOATS_PER_VERTEX = 4;

    describe("bezier coordinates", () =>
    {
        it("should always set bezier coordinates to (0.5, 0.5) for straight lines", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ];
            const buffer = new Float32Array(9 * FLOATS_PER_VERTEX);

            execute(vertex, buffer, 0);

            // First vertex of first triangle: bezier at indices 2, 3
            expect(buffer[2]).toBe(0.5);
            expect(buffer[3]).toBe(0.5);

            // Second vertex of first triangle: bezier at indices 4 + 2, 4 + 3
            expect(buffer[FLOATS_PER_VERTEX + 2]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX + 3]).toBe(0.5);

            // Third vertex of first triangle: bezier at indices 8 + 2, 8 + 3
            expect(buffer[FLOATS_PER_VERTEX * 2 + 2]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX * 2 + 3]).toBe(0.5);
        });

        it("should always set bezier coordinates to (0.5, 0.5) for curves", () =>
        {
            // A curve path: start -> control -> end
            const vertex: IPath = [
                0, 0, false,     // start point
                50, 50, true,    // control point (curve flag)
                100, 0, false,   // end point
                0, 0, false      // close
            ];
            const buffer = new Float32Array(6 * FLOATS_PER_VERTEX);

            const index = execute(vertex, buffer, 0);

            // Should process 2 triangles (curve + closing)
            expect(index).toBe(6);

            // First triangle (curve): bezier should be (0.5, 0.5), NOT Loop-Blinn values
            expect(buffer[2]).toBe(0.5);
            expect(buffer[3]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX + 2]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX + 3]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX * 2 + 2]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX * 2 + 3]).toBe(0.5);
        });

        it("should return correct index count", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ];
            const buffer = new Float32Array(9 * FLOATS_PER_VERTEX);

            const index = execute(vertex, buffer, 0);

            // 2 triangles = 6 vertices
            expect(index).toBe(6);
        });
    });

    describe("edge cases", () =>
    {
        it("should handle path with minimum points", () =>
        {
            // Minimum valid path: 2 points (6 elements) doesn't produce triangles
            // Need at least 3 non-curve points for 1 triangle
            const vertex: IPath = [
                0, 0, false,
                100, 0, false
            ];
            const buffer = new Float32Array(3 * FLOATS_PER_VERTEX);

            const index = execute(vertex, buffer, 0);

            // Not enough points for triangle
            expect(index).toBe(0);
        });

        it("should handle starting index offset", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ];
            const buffer = new Float32Array(20 * FLOATS_PER_VERTEX);

            const index = execute(
                vertex, buffer, 5  // start at index 5
            );

            // Should return 5 + 6 = 11
            expect(index).toBe(11);

            // Data should start at index 5 * 4 = 20
            // Verify bezier at position 20 + 2 = 22
            expect(buffer[20 + 2]).toBe(0.5);
            expect(buffer[20 + 3]).toBe(0.5);
        });
    });
});
