import { GradientBevelFilter } from "../../GradientBevelFilter";
import { execute } from "./GradientBevelFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("GradientBevelFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter(
            4, 45, [0x000000, 0xFFFFFF], [0, 1], [0, 255], 4, 4, 1
        );
        expect(execute(gradientBevelFilter)).toBe(true);

        gradientBevelFilter.blurX = 0;
        expect(execute(gradientBevelFilter)).toBe(false);

        gradientBevelFilter.blurX = 1;
        gradientBevelFilter.blurY = 0;
        expect(execute(gradientBevelFilter)).toBe(false);

        gradientBevelFilter.blurY = 1;
        gradientBevelFilter.quality = 0;
        expect(execute(gradientBevelFilter)).toBe(false);

        gradientBevelFilter.quality = 1;
        expect(execute(gradientBevelFilter)).toBe(true);
    });
});