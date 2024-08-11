import { DisplacementMapFilter } from "./DisplacementMapFilter";
import { describe, expect, it } from "vitest";

describe("DisplacementMapFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new DisplacementMapFilter().namespace).toBe("next2d.filters.DisplacementMapFilter");
    });

    it("namespace test static", () =>
    {
        expect(DisplacementMapFilter.namespace).toBe("next2d.filters.DisplacementMapFilter");
    });
});