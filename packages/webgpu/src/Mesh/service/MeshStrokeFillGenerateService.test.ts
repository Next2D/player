import { describe, it, expect } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshStrokeFillGenerateService";

describe("MeshStrokeFillGenerateService", () =>
{
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
            const buffer = new Float32Array(9 * 17);

            execute(
                vertex, buffer, 0,
                1, 0, 0, 1, 0, 0,  // a, b, c, d, tx, ty
                1, 0, 0, 1         // red, green, blue, alpha
            );

            // First vertex of first triangle: bezier at indices 2, 3
            expect(buffer[2]).toBe(0.5);
            expect(buffer[3]).toBe(0.5);

            // Second vertex of first triangle: bezier at indices 17 + 2, 17 + 3
            expect(buffer[19]).toBe(0.5);
            expect(buffer[20]).toBe(0.5);

            // Third vertex of first triangle: bezier at indices 34 + 2, 34 + 3
            expect(buffer[36]).toBe(0.5);
            expect(buffer[37]).toBe(0.5);
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
            const buffer = new Float32Array(6 * 17);

            const index = execute(
                vertex, buffer, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1
            );

            // Should process 2 triangles (curve + closing)
            expect(index).toBe(6);

            // First triangle (curve): bezier should be (0.5, 0.5), NOT Loop-Blinn values
            expect(buffer[2]).toBe(0.5);
            expect(buffer[3]).toBe(0.5);
            expect(buffer[19]).toBe(0.5);
            expect(buffer[20]).toBe(0.5);
            expect(buffer[36]).toBe(0.5);
            expect(buffer[37]).toBe(0.5);
        });

        it("should return correct index count", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false,
                0, 0, false
            ];
            const buffer = new Float32Array(9 * 17);

            const index = execute(
                vertex, buffer, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1
            );

            // 2 triangles = 6 vertices
            expect(index).toBe(6);
        });
    });

    describe("color values", () =>
    {
        it("should set correct color values", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                0, 0, false
            ];
            const buffer = new Float32Array(3 * 17);

            execute(
                vertex, buffer, 0,
                1, 0, 0, 1, 0, 0,
                0.5, 0.6, 0.7, 0.8  // red, green, blue, alpha
            );

            // Color at indices 4, 5, 6, 7
            expect(buffer[4]).toBeCloseTo(0.5, 5);  // red
            expect(buffer[5]).toBeCloseTo(0.6, 5);  // green
            expect(buffer[6]).toBeCloseTo(0.7, 5);  // blue
            expect(buffer[7]).toBeCloseTo(0.8, 5);  // alpha
        });
    });

    describe("matrix values", () =>
    {
        it("should set correct matrix values", () =>
        {
            const vertex: IPath = [
                0, 0, false,
                100, 0, false,
                0, 0, false
            ];
            const buffer = new Float32Array(3 * 17);

            execute(
                vertex, buffer, 0,
                2, 0.1, 0.2, 3, 10, 20,  // a, b, c, d, tx, ty
                1, 0, 0, 1
            );

            // Matrix row 0 at indices 8, 9, 10
            expect(buffer[8]).toBeCloseTo(2, 5);    // a
            expect(buffer[9]).toBeCloseTo(0.1, 5);  // b
            expect(buffer[10]).toBeCloseTo(0, 5);   // padding

            // Matrix row 1 at indices 11, 12, 13
            expect(buffer[11]).toBeCloseTo(0.2, 5); // c
            expect(buffer[12]).toBeCloseTo(3, 5);   // d
            expect(buffer[13]).toBeCloseTo(0, 5);   // padding

            // Matrix row 2 at indices 14, 15, 16
            expect(buffer[14]).toBeCloseTo(10, 5);  // tx
            expect(buffer[15]).toBeCloseTo(20, 5);  // ty
            expect(buffer[16]).toBeCloseTo(1, 5);   // 1 (for affine transform)
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
            const buffer = new Float32Array(3 * 17);

            const index = execute(
                vertex, buffer, 0,
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1
            );

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
            const buffer = new Float32Array(20 * 17);

            const index = execute(
                vertex, buffer, 5,  // start at index 5
                1, 0, 0, 1, 0, 0,
                1, 0, 0, 1
            );

            // Should return 5 + 6 = 11
            expect(index).toBe(11);

            // Data should start at index 5 * 17 = 85
            // Verify bezier at position 85 + 2 = 87
            expect(buffer[87]).toBe(0.5);
            expect(buffer[88]).toBe(0.5);
        });
    });
});
