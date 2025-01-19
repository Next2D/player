import { GlowFilter } from "../../GlowFilter";
import { execute } from "./GlowFilterGetBoundsUseCase";
import { describe, expect, it } from "vitest";

describe("GlowFilterGetBoundsUseCase.js test", () =>
{
    it("test case1", () =>
    {
        const bounds = new Float32Array([0, 0, 0, 0]);
        execute(new GlowFilter(), bounds);

        expect(bounds[0]).toBe(-2);
        expect(bounds[1]).toBe(-2);
        expect(bounds[2]).toBe(2);
        expect(bounds[3]).toBe(2);
    });
});