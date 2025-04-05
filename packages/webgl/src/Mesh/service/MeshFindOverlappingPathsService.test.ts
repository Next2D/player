import { execute } from "./MeshFindOverlappingPathsService";
import { describe, expect, it } from "vitest";

describe("MeshFindOverlappingPathsService.js method test", () =>
{
    it("test case", () =>
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
        const points = execute(0, 0, 0, paths);
        expect(points.length).toBe(2);
    });
});