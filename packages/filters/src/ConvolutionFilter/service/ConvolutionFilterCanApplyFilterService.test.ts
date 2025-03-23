import { ConvolutionFilter } from "../../ConvolutionFilter";
import { execute } from "./ConvolutionFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("ConvolutionFilterCanApplyFilterService.js test", () =>
{
    it("test case1", () =>
    {
        const convolutionFilter = new ConvolutionFilter();
        expect(execute(convolutionFilter)).toBe(false);
    });

    it("test case2", () =>
    {
        const convolutionFilter = new ConvolutionFilter(
            3, 3, [
                0.05090, 0.12381, 0.05090,
                0.12381, 0.30116, 0.12381,
                0.05090, 0.12381, 0.05090
            ]
        );
        expect(execute(convolutionFilter)).toBe(true);

        convolutionFilter.matrixX = 2;
        expect(execute(convolutionFilter)).toBe(false);

        convolutionFilter.matrixX = 3;
        convolutionFilter.matrixY = 2;
        expect(execute(convolutionFilter)).toBe(false);

        convolutionFilter.matrixY = 3;
        convolutionFilter.matrix = null;
        expect(execute(convolutionFilter)).toBe(false);

        convolutionFilter.matrix = [
            0.05090, 0.12381, 0.05090,
            0.12381, 0.30116, 0.12381,
            0.05090, 0.12381, 0.05090
        ];
        expect(execute(convolutionFilter)).toBe(true);
    });
});