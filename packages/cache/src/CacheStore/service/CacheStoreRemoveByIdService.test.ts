import { $cacheStore } from "../../CacheStore";
import { execute } from "./CacheStoreRemoveByIdService";
import { describe, expect, it } from "vitest";

describe("CacheStoreRemoveByIdService.js test", () =>
{
    it("test case1", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        store.set("1", data);

        expect(data.size).toBe(1);
        expect(store.size).toBe(1);

        execute($cacheStore, store, "1");
        expect(data.size).toBe(0);
        expect(store.size).toBe(0);
    });
});