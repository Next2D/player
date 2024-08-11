import { DropShadowFilter } from "./DropShadowFilter";
import { describe, expect, it } from "vitest";

describe("DropShadowFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new DropShadowFilter().namespace).toBe("next2d.filters.DropShadowFilter");
    });

    it("namespace test static", () =>
    {
        expect(DropShadowFilter.namespace).toBe("next2d.filters.DropShadowFilter");
    });
});