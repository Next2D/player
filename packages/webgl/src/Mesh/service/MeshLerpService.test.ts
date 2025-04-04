import { execute } from "./MeshLerpService";
import { describe, expect, it } from "vitest";

describe("MeshLerpService.js method test", () =>
{
    it("test case", () =>
    {
        expect(execute({ x: 1.2, y: 0.9 }, { x: 10.8, y: 56.1 }, 0.332))
            .toEqual({ x: 4.387200000000001, y: 19.2264 });
    });
});