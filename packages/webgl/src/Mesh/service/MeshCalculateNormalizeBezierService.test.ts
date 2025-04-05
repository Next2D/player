import { execute } from "./MeshCalculateNormalizeBezierService";
import { describe, expect, it } from "vitest";
import type { IPoint } from "../../interface/IPoint";

describe("MeshCalculateNormalizeBezierService.js method test", () =>
{
    it("test case", () =>
    {
        const point: IPoint = { "x": 3, "y": 4 };
        expect(point.x).toBe(3);
        expect(point.y).toBe(4);
        
        const result = execute(point);        
        expect(result.x).toBe(0.6);
        expect(result.y).toBe(0.8);
    });
});