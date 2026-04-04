import { describe, it, expect, vi } from "vitest";
import type { IPath } from "../../interface/IPath";
import {
    generateStrokeOutline,
    generateStrokeMesh
} from "./MeshStrokeGenerateUseCase";

// Mock $context
vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        "joints": 0, // bevel by default
        "caps": 0    // none by default
    }
}));

describe("MeshStrokeGenerateUseCase", () =>
{
    describe("generateStrokeOutline", () =>
    {
        it("should return empty array for path with insufficient points", () =>
        {
            const vertices: IPath = [0, 0, false]; // Only 1 point

            const result = generateStrokeOutline(vertices, 5);

            expect(result).toEqual([]);
        });

        it("should generate IPath for simple line segment", () =>
        {
            const vertices: IPath = [
                0, 0, false,   // start point
                100, 0, false  // end point
            ];

            const result = generateStrokeOutline(vertices, 5);

            expect(result.length).toBe(1);
            // IPath is an array [x, y, isCurve, ...]
            expect(Array.isArray(result[0])).toBe(true);
            // Rectangle has 5 points (15 elements) - closed path
            expect(result[0].length).toBe(15);
        });

        it("should calculate correct normal offset for horizontal line", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                100, 0, false
            ];

            const result = generateStrokeOutline(vertices, 10);

            // For horizontal line (direction = (100, 0)), normal is perpendicular:
            // normal.x = -(y / magnitude) * thickness = 0
            // normal.y = (x / magnitude) * thickness = 1 * 10 = 10
            // Path format: [startUpX, startUpY, false, endUpX, endUpY, false, endDownX, endDownY, false, startDownX, startDownY, false, ...]
            const startUpY = result[0][1] as number;
            const startDownY = result[0][10] as number;
            expect(startUpY).toBeCloseTo(10, 5);
            expect(startDownY).toBeCloseTo(-10, 5);
        });

        it("should calculate correct normal offset for vertical line", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                0, 100, false
            ];

            const result = generateStrokeOutline(vertices, 10);

            // For vertical line (direction = (0, 100)), normal is perpendicular:
            // normal.x = -(y / magnitude) * thickness = -(100 / 100) * 10 = -10
            // normal.y = (x / magnitude) * thickness = 0
            const startUpX = result[0][0] as number;
            const startDownX = result[0][9] as number;
            expect(startUpX).toBeCloseTo(-10, 5);
            expect(startDownX).toBeCloseTo(10, 5);
        });

        it("should generate multiple paths for multi-segment path", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false
            ];

            const result = generateStrokeOutline(vertices, 5);

            // 2 line segments create 2 rectangles, plus 1 join triangle
            expect(result.length).toBeGreaterThanOrEqual(2);
        });

        it("should handle curve control points", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                50, 50, true,  // control point
                100, 0, false
            ];

            const result = generateStrokeOutline(vertices, 5);

            // Curve generates one outline (more complex than rectangle)
            expect(result.length).toBe(1);
            // Curve path has more points than a simple rectangle
            expect(result[0].length).toBeGreaterThan(15);
        });
    });

    describe("generateStrokeMesh", () =>
    {
        it("should return IPath array", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = generateStrokeMesh(vertices, 10);

            expect(Array.isArray(result)).toBe(true);
            expect(result.length).toBeGreaterThan(0);
        });

        it("should generate outline paths for line segment", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = generateStrokeMesh(vertices, 10);

            // One line segment creates one rectangle path
            expect(result.length).toBe(1);
            expect(result[0].length).toBe(15); // 5 points * 3 = 15
        });

        it("should skip paths with insufficient points", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false // Only one point
            ]];

            const result = generateStrokeMesh(vertices, 10);

            expect(result.length).toBe(0);
        });

        it("should handle multiple paths", () =>
        {
            const vertices: IPath[] = [
                [0, 0, false, 100, 0, false],
                [200, 200, false, 300, 200, false]
            ];

            const result = generateStrokeMesh(vertices, 10);

            // 2 line segments create 2 rectangle paths
            expect(result.length).toBe(2);
        });

        it("should use half thickness internally", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            // Thickness = 20, so halfThickness = 10
            const result = generateStrokeMesh(vertices, 20);

            // Check that the y-offset is ±10 (halfThickness)
            // First vertex Y should be at 10 (startUpY)
            const startUpY = result[0][1] as number;
            expect(Math.abs(startUpY)).toBeCloseTo(10, 5);
        });
    });

});
