import { GradientGlowFilter } from "./GradientGlowFilter";
import { describe, expect, it } from "vitest";

describe("GradientGlowFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new GradientGlowFilter().namespace).toBe("next2d.filters.GradientGlowFilter");
    });

    it("namespace test static", () =>
    {
        expect(GradientGlowFilter.namespace).toBe("next2d.filters.GradientGlowFilter");
    });
});