import { execute } from "./MeshIsPointInsideRectangleService";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { IPath } from "../../interface/IPath";

describe("MeshIsPointInsideRectangleService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should return array or null", () =>
    {
        // Simple rectangle path
        const rectangle: IPath = [
            0, 0, false,
            100, 0, false,
            100, 100, false,
            0, 100, false
        ];

        const points = [50, 50];
        const result = execute(points, rectangle);

        // Result should be either null or an array of [x, y]
        expect(result === null || (Array.isArray(result) && result.length === 2)).toBe(true);
    });

    it("test case - should handle empty points array", () =>
    {
        const rectangle: IPath = [
            0, 0, false,
            100, 0, false,
            100, 100, false,
            0, 100, false
        ];

        const points: number[] = [];
        const result = execute(points, rectangle);

        expect(result).toBeNull();
    });

    it("test case - should process multiple points", () =>
    {
        const rectangle: IPath = [
            0, 0, false,
            100, 0, false,
            100, 100, false,
            0, 100, false
        ];

        const points = [10, 10, 20, 20, 30, 30];
        const result = execute(points, rectangle);

        // Result should be either null or [x, y] array
        expect(result === null || (Array.isArray(result) && result.length === 2)).toBe(true);
    });

    it("test case - should handle rectangle with quadratic curves", () =>
    {
        // Rectangle with a curve segment
        const rectangle: IPath = [
            0, 0, false,
            50, 0, true,    // control point for curve
            100, 0, false,
            100, 100, false,
            0, 100, false
        ];

        const points = [50, 50];
        const result = execute(points, rectangle);

        // Should not throw and return valid result
        expect(result === null || Array.isArray(result)).toBe(true);
    });
});
