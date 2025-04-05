import { execute } from "./MeshCalculateNormalVectorService";
import { describe, expect, it } from "vitest";

describe("MeshCalculateNormalVectorService.js method test", () =>
{
    it("test case", () =>
    {
        const point = execute(10, 20, 5);
        expect(point.x).toBe(-4.47213595499958);
        expect(point.y).toBe(2.23606797749979);
    });
});