import { execute } from "./MeshFindOverlappingPathsService";
import { describe, expect, it } from "vitest";

describe("MeshFindOverlappingPathsService.js method test", () =>
{
    it("test case - returns points at exact distance r", () =>
    {
        const paths = [
            0, 0, false,
            10, 0, false,
            20, 0, false,
            30, 0, false,
            40, 0, false,
            50, 0, false,
            60, 0, false,
            70, 0, false,
            80, 0, false,
            90, 0, false,
            100, 0, false,
            110, 0, false,
            120, 0, false,
            130, 0, false
        ];
        // Only returns point (0,0) which is exactly at distance 0 from center (0,0)
        const points = execute(0, 0, 0, paths);
        expect(points.length).toBe(2);
        expect(points[0]).toBe(0);
        expect(points[1]).toBe(0);
    });

    it("test case - returns points at specified radius", () =>
    {
        const paths = [
            5, 0, false,   // distance 5 from origin
            -5, 0, false,  // distance 5 from origin
            0, 5, false,   // distance 5 from origin
            10, 0, false,  // distance 10 from origin
        ];
        // Returns points at distance 5 (within epsilon 0.01)
        const points = execute(0, 0, 5, paths);
        expect(points.length).toBe(6); // 3 points * 2 (x,y)
    });
});