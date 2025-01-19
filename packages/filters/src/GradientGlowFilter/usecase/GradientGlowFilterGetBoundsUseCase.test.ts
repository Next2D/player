import { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute } from "./GradientGlowFilterGetBoundsUseCase";
import { describe, expect, it } from "vitest";

describe("GlowFilterGetBoundsUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new GradientGlowFilter(), bounds);

        expect(bounds[0]).toBe(0);
        expect(bounds[1]).toBe(0);
        expect(bounds[2]).toBe(0);
        expect(bounds[3]).toBe(0);
    });
});