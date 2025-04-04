import { execute } from "./MeshGenerateCalculateSquareCapService";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateSquareCapService.js method test", () =>
{
    it("test case", () =>
    {
        const vertices = [
            0, 0, false,
            0, 100, false, 
            100, 100, false, 
            100, 0, false,
            90, 0, false,
            100, -10, false,
            0, 0, false,
        ];
        const r = 10;
        const rectangles: number[][] = [];

        execute(vertices, r, rectangles);

        expect(rectangles.length).toBe(2);
        expect(rectangles[0]).toEqual([
            10, -20, false,
            -10, -20, false,
            -10, 0, false,
            10, -20, false,
            -10, 0, false,
            10, 0, false,
        ]);
    });
});