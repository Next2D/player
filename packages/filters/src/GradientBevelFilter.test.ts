import { GradientBevelFilter } from "./GradientBevelFilter";
import { describe, expect, it } from "vitest";

describe("GradientBevelFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new GradientBevelFilter().namespace).toBe("next2d.filters.GradientBevelFilter");
    });

    it("namespace test static", () =>
    {
        expect(GradientBevelFilter.namespace).toBe("next2d.filters.GradientBevelFilter");
    });
});

describe("GradientBevelFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const gradientBevelFilter = new GradientBevelFilter();
        expect(gradientBevelFilter.distance).toBe(4);
        expect(gradientBevelFilter.angle).toBe(45);
        expect(gradientBevelFilter.colors).toBe(null);
        expect(gradientBevelFilter.alphas).toBe(null);
        expect(gradientBevelFilter.ratios).toBe(null);
        expect(gradientBevelFilter.blurX).toBe(4);
        expect(gradientBevelFilter.blurY).toBe(4);
        expect(gradientBevelFilter.strength).toBe(1);
        expect(gradientBevelFilter.quality).toBe(1);
        expect(gradientBevelFilter.type).toBe("inner");
        expect(gradientBevelFilter.knockout).toBe(false);
    });
});