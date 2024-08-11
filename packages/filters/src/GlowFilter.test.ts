import { GlowFilter } from "./GlowFilter";
import { describe, expect, it } from "vitest";

describe("GlowFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new GlowFilter().namespace).toBe("next2d.filters.GlowFilter");
    });

    it("namespace test static", () =>
    {
        expect(GlowFilter.namespace).toBe("next2d.filters.GlowFilter");
    });
});