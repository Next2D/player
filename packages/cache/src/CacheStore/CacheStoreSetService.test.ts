import { $cacheStore } from "../";
import { execute } from "./CacheStoreSetService";
import { describe, expect, it } from "vitest";

describe("CacheStoreSetService.js test", () =>
{
    it("test case1", () =>
    {
        const store = new Map();
        expect(store.size).toBe(0);

        execute($cacheStore, store, ["1", "0"], "test");

        expect(store.size).toBe(1);

        const data = store.get("1");
        expect(data.size).toBe(1);
        expect(data.get("0")).toBe("test");
    });
});