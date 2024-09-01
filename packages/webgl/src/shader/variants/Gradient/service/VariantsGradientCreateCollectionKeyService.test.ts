import { execute } from "./VariantsGradientCreateCollectionKeyService";
import { describe, expect, it, vi } from "vitest";

describe("VariantsGradientCreateCollectionKeyService.js method test", () =>
{
    it("test case", () =>
    {
        expect(execute(true, true, true, true, 0)).toBe("yyyy0");
        expect(execute(true, true, true, true, 1)).toBe("yyyy1");
        expect(execute(true, true, true, false, 0)).toBe("yyyn0");
        expect(execute(true, true, false, false, 0)).toBe("yynn0");
        expect(execute(true, false, false, false, 0)).toBe("ynnn0");
        expect(execute(false, false, false, false, 0)).toBe("nnnn0");
    });
});