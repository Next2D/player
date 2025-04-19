import { execute } from "./CacheStoreGenerateKeysService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGenerateKeysService.js test", () =>
{
    it("test case1", () =>
    {
        expect(execute(0.25, 0.5, 0)).toBe(12414094);
    });

    it("test case2", () =>
    {
        expect(execute(0.25, 0.5, 0.3)).toBe(763280);
    });
});