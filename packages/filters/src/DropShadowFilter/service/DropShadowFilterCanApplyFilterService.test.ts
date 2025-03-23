import { DropShadowFilter } from "../../DropShadowFilter";
import { execute } from "./DropShadowFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("DropShadowFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const dropShadowFilter = new DropShadowFilter();
        expect(execute(dropShadowFilter)).toBe(true);

        dropShadowFilter.blurX = 0;
        expect(execute(dropShadowFilter)).toBe(false);

        dropShadowFilter.blurX = 1;
        dropShadowFilter.blurY = 0;
        expect(execute(dropShadowFilter)).toBe(false);

        dropShadowFilter.blurY = 1;
        dropShadowFilter.quality = 0;
        expect(execute(dropShadowFilter)).toBe(false);

        dropShadowFilter.quality = 1;
        expect(execute(dropShadowFilter)).toBe(true);

        dropShadowFilter.alpha = 0;
        expect(execute(dropShadowFilter)).toBe(false);

        dropShadowFilter.alpha = 1;
        dropShadowFilter.strength = 0;
        expect(execute(dropShadowFilter)).toBe(false);

        dropShadowFilter.strength = 1;
        expect(execute(dropShadowFilter)).toBe(true);
    });
});