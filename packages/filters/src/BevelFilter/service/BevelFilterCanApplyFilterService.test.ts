import { BevelFilter } from "../../BevelFilter";
import { execute } from "./BevelFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("BevelFilterCanApplyFilterService.js test", () =>
{
    it("test case", () =>
    {
        const bevelFilter = new BevelFilter();
        expect(execute(bevelFilter)).toBe(true);

        bevelFilter.blurX = 0;
        expect(execute(bevelFilter)).toBe(false);

        bevelFilter.blurX = 1;
        bevelFilter.blurY = 0;
        expect(execute(bevelFilter)).toBe(false);

        bevelFilter.blurY = 1;
        bevelFilter.quality = 0;
        expect(execute(bevelFilter)).toBe(false);

        bevelFilter.quality = 1;
        expect(execute(bevelFilter)).toBe(true);

        bevelFilter.strength = 0;
        expect(execute(bevelFilter)).toBe(false);

        bevelFilter.strength = 1;
        bevelFilter.distance = 0;
        expect(execute(bevelFilter)).toBe(false);

        bevelFilter.distance = 1;
        expect(execute(bevelFilter)).toBe(true);
    });
});