import { DisplacementMapFilter } from "../../DisplacementMapFilter";
import { execute } from "./DisplacementMapFilterCanApplyFilterService";
import { describe, expect, it } from "vitest";

describe("DisplacementMapFilterCanApplyFilterService.js test", () =>
{
    it("test case1", () =>
    {
        const displacementMapFilter = new DisplacementMapFilter();
        expect(execute(displacementMapFilter)).toBe(false);
    });

    it("test case2", () =>
    {
        const displacementMapFilter = new DisplacementMapFilter(
            new Uint8Array([0, 0, 0, 0]), 1, 1, 1, 1, 1, 1, 1, 1
        );
        expect(execute(displacementMapFilter)).toBe(true);
    });
});