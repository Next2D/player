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

describe("ConvolutionFilter.js property test", () =>
{
    it("default test success", () =>
    {
        const convolutionFilter = new ConvolutionFilter();
        expect(convolutionFilter.alpha).toBe(0);
        expect(convolutionFilter.bias).toBe(0);
        expect(convolutionFilter.clamp).toBe(true);
        expect(convolutionFilter.color).toBe(0);
        expect(convolutionFilter.divisor).toBe(1);
        expect(convolutionFilter.matrix).toBe(null);
        expect(convolutionFilter.matrixX).toBe(0);
        expect(convolutionFilter.matrixY).toBe(0);
        expect(convolutionFilter.preserveAlpha).toBe(true);
    });
});