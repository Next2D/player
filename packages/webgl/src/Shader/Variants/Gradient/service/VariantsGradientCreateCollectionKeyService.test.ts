import { execute } from "./VariantsGradientCreateCollectionKeyService";
import { describe, expect, it, vi } from "vitest";

describe("VariantsGradientCreateCollectionKeyService.js method test", () =>
{
    it("test case", () =>
    {
        expect(execute(true, true, true, 0)).toBe("yyy0");
        expect(execute(true, true, true, 1)).toBe("yyy1");
        expect(execute(true, true, false, 0)).toBe("yyn0");
        expect(execute(true, false, false, 0)).toBe("ynn0");
        expect(execute(false, false, false, 0)).toBe("nnn0");
        expect(execute(false, false, false, 0)).toBe("nnn0");
    });
});