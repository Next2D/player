import { execute } from "./MeshGenerateCalculateRoundCapService";
import { describe, expect, it } from "vitest";

describe("MeshGenerateCalculateRoundCapService.js method test", () =>
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
            10, 0, false,
            9.807852804032304, -1.9509032201612824, false,
            9.238795325112868, -3.826834323650898, false,
            8.314696123025453, -5.555702330196022, false,
            7.0710678118654755, -7.071067811865475, false,
            5.555702330196023, -8.314696123025453, false,
            3.8268343236508984, -9.238795325112868, false,
            1.9509032201612833, -9.807852804032304, false,
            6.123233995736766e-16, -10, false,
            -1.950903220161282, -9.807852804032304, false,
            -3.826834323650897, -9.238795325112868, false,
            -5.55570233019602, -8.314696123025453, false,
            -7.071067811865475, -7.0710678118654755, false,
            -8.314696123025453, -5.555702330196022, false,
            -9.238795325112868, -3.826834323650899, false,
            -9.807852804032304, -1.9509032201612861, false,
            -10, -1.2246467991473533e-15, false
        ]);
    });
});