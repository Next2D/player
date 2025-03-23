import { GlowFilter } from "../../GlowFilter";
import { execute } from "./GlowFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("GlowFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const glowFilter = new GlowFilter();
        expect(execute(glowFilter)).toBe(true);

        glowFilter.blurX = 0;
        expect(execute(glowFilter)).toBe(false);

        glowFilter.blurX = 1;
        glowFilter.blurY = 0;
        expect(execute(glowFilter)).toBe(false);

        glowFilter.blurY = 1;
        glowFilter.quality = 0;
        expect(execute(glowFilter)).toBe(false);

        glowFilter.quality = 1;
        expect(execute(glowFilter)).toBe(true);

        glowFilter.alpha = 0;
        expect(execute(glowFilter)).toBe(false);

        glowFilter.alpha = 1;
        glowFilter.strength = 0;
        expect(execute(glowFilter)).toBe(false);

        glowFilter.strength = 1;
        expect(execute(glowFilter)).toBe(true);
    });
});