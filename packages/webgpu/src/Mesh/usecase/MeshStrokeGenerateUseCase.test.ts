import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";
import type { IPoint } from "../../interface/IPoint";
import {
    generateStrokeOutline,
    generateStrokeMesh,
    generateStrokeMeshFromPoints
} from "./MeshStrokeGenerateUseCase";

// Mock $context and Debug
vi.mock("../../WebGPUUtil", () => ({
    "$context": {
        "joints": 0 // bevel by default
    }
}));

vi.mock("../../Debug/DebugLogger", () => ({
    "isDebugEnabled": vi.fn(() => false),
    "logStroke": vi.fn()
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

        it("should generate rectangle info for simple line segment", () =>
        {
            const vertices: IPath = [
                0, 0, false,   // start point
                100, 0, false  // end point
            ];

            const result = generateStrokeOutline(vertices, 5);

            expect(result.length).toBe(1);
            expect(result[0]).toHaveProperty("path");
            expect(result[0]).toHaveProperty("startUp");
            expect(result[0]).toHaveProperty("startDown");
            expect(result[0]).toHaveProperty("endUp");
            expect(result[0]).toHaveProperty("endDown");
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
            // So startUp = (0, 0 + 10) = (0, 10), startDown = (0, 0 - 10) = (0, -10)
            expect(result[0].startUp.y).toBeCloseTo(10, 5);
            expect(result[0].startDown.y).toBeCloseTo(-10, 5);
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
            // So startUp = (0 + (-10), 0) = (-10, 0), startDown = (0 - (-10), 0) = (10, 0)
            expect(result[0].startUp.x).toBeCloseTo(-10, 5);
            expect(result[0].startDown.x).toBeCloseTo(10, 5);
        });

        it("should generate multiple rectangles for multi-segment path", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                100, 0, false,
                100, 100, false
            ];

            const result = generateStrokeOutline(vertices, 5);

            expect(result.length).toBe(2);
        });

        it("should skip curve control points", () =>
        {
            const vertices: IPath = [
                0, 0, false,
                50, 50, true,  // control point - should be skipped
                100, 0, false
            ];

            const result = generateStrokeOutline(vertices, 5);

            // Should only create one rectangle (direct line from start to end)
            expect(result.length).toBe(1);
        });
    });

    describe("generateStrokeMesh", () =>
    {
        it("should return Float32Array", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = generateStrokeMesh(vertices, 10);

            expect(result).toBeInstanceOf(Float32Array);
        });

        it("should generate triangles for line segment", () =>
        {
            const vertices: IPath[] = [[
                0, 0, false,
                100, 0, false
            ]];

            const result = generateStrokeMesh(vertices, 10);

            // Each line segment becomes a rectangle = 2 triangles
            // Each triangle has 3 vertices, each vertex has 4 floats (x, y, 0, 0)
            // 2 triangles * 3 vertices * 4 floats = 24
            expect(result.length).toBe(24);
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

            // 2 line segments * 24 floats each
            expect(result.length).toBe(48);
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
            // First triangle vertex should be at (0, -10)
            expect(Math.abs(result[1])).toBeCloseTo(10, 5);
        });
    });

    describe("generateStrokeMeshFromPoints", () =>
    {
        it("should return Float32Array", () =>
        {
            const paths: IPoint[][] = [[
                { "x": 0, "y": 0 },
                { "x": 100, "y": 0 }
            ]];

            const result = generateStrokeMeshFromPoints(paths, 10);

            expect(result).toBeInstanceOf(Float32Array);
        });

        it("should generate triangles for line segment", () =>
        {
            const paths: IPoint[][] = [[
                { "x": 0, "y": 0 },
                { "x": 100, "y": 0 }
            ]];

            const result = generateStrokeMeshFromPoints(paths, 10);

            // 2 triangles * 3 vertices * 4 floats = 24
            expect(result.length).toBe(24);
        });

        it("should skip paths with single point", () =>
        {
            const paths: IPoint[][] = [[
                { "x": 0, "y": 0 }
            ]];

            const result = generateStrokeMeshFromPoints(paths, 10);

            expect(result.length).toBe(0);
        });

        it("should handle multi-segment path", () =>
        {
            const paths: IPoint[][] = [[
                { "x": 0, "y": 0 },
                { "x": 100, "y": 0 },
                { "x": 100, "y": 100 }
            ]];

            const result = generateStrokeMeshFromPoints(paths, 10);

            // 2 line segments * 24 floats each = 48
            expect(result.length).toBe(48);
        });

        it("should handle multiple separate paths", () =>
        {
            const paths: IPoint[][] = [
                [{ "x": 0, "y": 0 }, { "x": 100, "y": 0 }],
                [{ "x": 200, "y": 200 }, { "x": 300, "y": 200 }]
            ];

            const result = generateStrokeMeshFromPoints(paths, 10);

            // 2 paths * 1 line segment each * 24 floats = 48
            expect(result.length).toBe(48);
        });
    });
});
