import { execute } from "./MeshGetQuadraticBezierPointService";
import { describe, expect, it } from "vitest";

describe("MeshGetQuadraticBezierPointService.js method test", () =>
{
    it("test case", () =>
    {
        expect(execute(10, { x: 11, y: 0.7 }, { x: 1.3, y: 12 }, { x: 29, y: 32 }))
            .toEqual({ x: 3557, y: 1096.6999999999998 });
    });
});