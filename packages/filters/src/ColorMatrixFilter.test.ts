import { ColorMatrixFilter } from "./ColorMatrixFilter";
import { describe, expect, it } from "vitest";

describe("ColorMatrixFilter.js property test", () =>
{
    // default
    it("default test success", () =>
    {
        const matrix = [
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ];

        const colorMatrixFilter = new ColorMatrixFilter();
        for (let i = 0; i < matrix.length; i++) {
            expect(colorMatrixFilter.matrix[i]).toBe(matrix[i]);
        }
    });

    it("matrix test case1", () =>
    {
        const colorMatrixFilter = new ColorMatrixFilter();

        colorMatrixFilter.$updated = false;
        expect(colorMatrixFilter.$updated).toBe(false);

        colorMatrixFilter.matrix = [
            1,  2,  3,  4,  5,
            6,  7,  8,  9,  10,
            11, 12, 13, 14, 15,
            16, 17, 18, 19, 20
        ];
        expect(colorMatrixFilter.matrix.length).toBe(20);
        expect(colorMatrixFilter.$updated).toBe(true);
    });
});