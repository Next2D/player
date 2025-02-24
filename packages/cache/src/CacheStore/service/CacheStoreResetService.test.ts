import { execute } from "./CacheStoreResetService";
import { describe, expect, it } from "vitest";
import { $cacheStore } from "../..";

describe("CacheStoreResetService.js test", () =>
{
    it("test case1", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        store.set("1", data);

        const trash = new Map();
        trash.set("2", "data");

        expect(data.size).toBe(1);
        expect(trash.size).toBe(1);
        expect(store.size).toBe(1);

        execute($cacheStore, store, trash);

        expect(data.size).toBe(0);
        expect(store.size).toBe(0);
        expect(trash.size).toBe(0);
    });
});