import { execute } from "./CacheStoreGenerateFilterKeysService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGenerateFilterKeysService.js test", () =>
{
    it("test case1", () =>
    {
        expect(execute(1, 0, 0, 1)).toBe(1507424);
    });

    it("test case2", () =>
    {
        expect(execute(0.25, 0.5, -0.3, 1.25)).toBe(-1648357538);
    });
});