import { GradientGlowFilter } from "./GradientGlowFilter";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const gradientGlowFilter = new GradientGlowFilter();
        expect(gradientGlowFilter.distance).toBe(4);
        expect(gradientGlowFilter.angle).toBe(45);
        expect(gradientGlowFilter.colors).toBe(null);
        expect(gradientGlowFilter.alphas).toBe(null);
        expect(gradientGlowFilter.ratios).toBe(null);
        expect(gradientGlowFilter.blurX).toBe(4);
        expect(gradientGlowFilter.blurY).toBe(4);
        expect(gradientGlowFilter.strength).toBe(1);
        expect(gradientGlowFilter.quality).toBe(1);
        expect(gradientGlowFilter.type).toBe("inner");
        expect(gradientGlowFilter.knockout).toBe(false);
    });
});