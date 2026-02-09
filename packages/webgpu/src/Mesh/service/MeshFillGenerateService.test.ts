import { describe, it, expect } from "vitest";
import type { IPath } from "../../interface/IPath";
import { execute } from "./MeshFillGenerateService";

describe("MeshFillGenerateService", () =>
{
    const FLOATS_PER_VERTEX = 4;

    describe("basic vertex generation", () =>
    {
        it("should return updated index after processing", () =>
        {
            // Simple triangle with bezier flag (vertex[idx+2] = true)
            // Format: [startX, startY, ?, x1, y1, bezierFlag, x2, y2, ?, ...]
            const vertex: IPath = [0, 0, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(1000);

            const newIndex = execute(vertex, buffer, 0);

            expect(newIndex).toBeGreaterThan(0);
        });

        it("should write 4 floats per vertex", () =>
        {
            // Triangle that triggers one iteration (bezier curve)
            const vertex: IPath = [0, 0, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(100);

            const newIndex = execute(vertex, buffer, 0);

            // Each iteration writes 3 vertices
            expect(newIndex).toBe(3);
        });

        it("should write position at correct offset", () =>
        {
            const vertex: IPath = [100, 200, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(100);

            execute(vertex, buffer, 0);

            // First vertex position comes from vertex[idx-3], vertex[idx-2]
            // idx starts at 3, so vertex[0] = 100, vertex[1] = 200
            expect(buffer[0]).toBe(100);
            expect(buffer[1]).toBe(200);
        });
    });

    describe("bezier curve handling", () =>
    {
        it("should set bezier coords for curve vertex (0, 0 for first)", () =>
        {
            const vertex: IPath = [0, 0, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(100);

            execute(vertex, buffer, 0);

            // First vertex bezier coords (u=0, v=0)
            expect(buffer[2]).toBe(0);
            expect(buffer[3]).toBe(0);

            // Second vertex bezier coords (u=0.5, v=0)
            expect(buffer[FLOATS_PER_VERTEX + 2]).toBe(0.5);
            expect(buffer[FLOATS_PER_VERTEX + 3]).toBe(0);

            // Third vertex bezier coords (u=1, v=1)
            expect(buffer[FLOATS_PER_VERTEX * 2 + 2]).toBe(1);
            expect(buffer[FLOATS_PER_VERTEX * 2 + 3]).toBe(1);
        });
    });

    describe("fan triangulation", () =>
    {
        it("should use start point for fan center", () =>
        {
            // Fan vertex (vertex[idx+2]=0, vertex[idx+5]=0)
            const vertex: IPath = [50, 50, 0, 10, 10, 0, 20, 20, 0] as IPath;
            const buffer = new Float32Array(100);

            execute(vertex, buffer, 0);

            // First vertex should be at start point (50, 50)
            expect(buffer[0]).toBe(50);
            expect(buffer[1]).toBe(50);
        });

        it("should set bezier coords to (0.5, 0.5) for non-curve vertices", () =>
        {
            const vertex: IPath = [50, 50, 0, 10, 10, 0, 20, 20, 0] as IPath;
            const buffer = new Float32Array(100);

            execute(vertex, buffer, 0);

            // All vertices should have (0.5, 0.5) for non-curve
            expect(buffer[2]).toBe(0.5);
            expect(buffer[3]).toBe(0.5);
        });
    });

    describe("index handling", () =>
    {
        it("should start writing at correct offset based on index", () =>
        {
            const vertex: IPath = [50, 60, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(200);

            const newIndex = execute(
                vertex, buffer, 2 // Start at index 2
            );

            // Should start at index 2 * 4 = 8
            // Buffer before should be zeros
            expect(buffer[0]).toBe(0);
            expect(buffer[FLOATS_PER_VERTEX]).toBe(0);

            // Buffer at index 2 should have data (position x=50)
            expect(buffer[FLOATS_PER_VERTEX * 2]).toBe(50);

            // Index should increment by 3 from starting index 2
            expect(newIndex).toBe(5);
        });

        it("should increment index by 3 per triangle", () =>
        {
            const vertex: IPath = [0, 0, 0, 10, 10, 1, 20, 0, 0] as IPath;
            const buffer = new Float32Array(100);

            const newIndex = execute(vertex, buffer, 0);

            // One triangle = 3 vertices
            expect(newIndex % 3).toBe(0);
        });
    });

    describe("empty/minimal input", () =>
    {
        it("should handle minimal vertex array", () =>
        {
            // Too short to trigger any iteration (length - 5 < 3)
            const vertex: IPath = [0, 0, 0, 10, 10] as IPath;
            const buffer = new Float32Array(100);

            const newIndex = execute(vertex, buffer, 0);

            expect(newIndex).toBe(0);
        });
    });
});
