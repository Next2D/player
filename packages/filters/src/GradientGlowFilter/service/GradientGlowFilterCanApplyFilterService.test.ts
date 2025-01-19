import { GradientGlowFilter } from "../../GradientGlowFilter";
import { execute } from "./GradientGlowFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter(
            4, 45, [0, 0], [0, 255], [0x000000, 0xFFFFFF], 4, 4, 1
        );
        expect(execute(gradientGlowFilter)).toBe(true);

        gradientGlowFilter.blurX = 0;
        expect(execute(gradientGlowFilter)).toBe(false);

        gradientGlowFilter.blurX = 1;
        gradientGlowFilter.blurY = 0;
        expect(execute(gradientGlowFilter)).toBe(false);

        gradientGlowFilter.blurY = 1;
        gradientGlowFilter.quality = 0;
        expect(execute(gradientGlowFilter)).toBe(false);

        gradientGlowFilter.quality = 1;
        expect(execute(gradientGlowFilter)).toBe(true);
    });
});