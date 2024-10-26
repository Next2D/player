import { GlowFilter } from "./GlowFilter";
import { describe, expect, it } from "vitest";

describe("GlowFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const glowFilter = new GlowFilter();
        expect(glowFilter.color).toBe(0);
        expect(glowFilter.alpha).toBe(1);
        expect(glowFilter.blurX).toBe(4);
        expect(glowFilter.blurY).toBe(4);
        expect(glowFilter.strength).toBe(1);
        expect(glowFilter.quality).toBe(1);
        expect(glowFilter.inner).toBe(false);
        expect(glowFilter.knockout).toBe(false);
    });
});