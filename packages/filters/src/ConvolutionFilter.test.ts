import { ConvolutionFilter } from "./ConvolutionFilter";
import { describe, expect, it } from "vitest";

describe("ConvolutionFilter.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new ConvolutionFilter().namespace).toBe("next2d.filters.ConvolutionFilter");
    });

    it("namespace test static", () =>
    {
        expect(ConvolutionFilter.namespace).toBe("next2d.filters.ConvolutionFilter");
    });
});