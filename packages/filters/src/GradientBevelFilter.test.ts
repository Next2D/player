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