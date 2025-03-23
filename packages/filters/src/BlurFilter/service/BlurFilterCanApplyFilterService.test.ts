import { BlurFilter } from "../../BlurFilter";
import { execute } from "./BlurFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("BlurFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const blurFilter = new BlurFilter();
        expect(execute(blurFilter)).toBe(true);

        blurFilter.blurX = 0;
        expect(execute(blurFilter)).toBe(false);

        blurFilter.blurX = 1;
        blurFilter.blurY = 0;
        expect(execute(blurFilter)).toBe(false);

        blurFilter.blurY = 1;
        blurFilter.quality = 0;
        expect(execute(blurFilter)).toBe(false);

        blurFilter.quality = 1;
        expect(execute(blurFilter)).toBe(true);
    });
});