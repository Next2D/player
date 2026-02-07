import { execute } from "./CacheStoreGenerateFilterKeysService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGenerateFilterKeysService.js test", () =>
{
    it("test case1", () =>
    {
        expect(execute(1, 0, 0, 1)).toBe(11788805);
    });

    it("test case2", () =>
    {
        expect(execute(0.25, 0.5, -0.3, 1.25)).toBe(845122);
    });

    it("same input should return same hash", () =>
    {
        expect(execute(1, 0, 0, 1)).toBe(execute(1, 0, 0, 1));
    });

    it("different input should return different hash", () =>
    {
        expect(execute(1, 0, 0, 1)).not.toBe(execute(0.25, 0.5, -0.3, 1.25));
    });

    it("return type should be number", () =>
    {
        expect(typeof execute(1, 0, 0, 1)).toBe("number");
    });
});