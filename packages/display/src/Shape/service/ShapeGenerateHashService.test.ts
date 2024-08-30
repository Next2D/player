import { execute } from "./ShapeGenerateHashService";
import { describe, expect, it } from "vitest";

describe("ShapeGenerateHashService.js test", () =>
{
    it("execute test case1", () =>
    {
        expect(execute(
            new Float32Array([0.25, 0.5, 0]),
        )).toBe(1407893850);
    });
});