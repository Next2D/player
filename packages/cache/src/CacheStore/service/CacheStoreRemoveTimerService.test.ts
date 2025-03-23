import { execute } from "./CacheStoreRemoveTimerService";
import { describe, expect, it } from "vitest";
import { $cacheStore } from "../..";

describe("CacheStoreRemoveTimerService.js test", () =>
{
    it("test case1", () =>
    {
        const trash = new Map();
        const data = new Map();
        const store = new Map();
        store.set("2", data);

        expect(data.has("trash")).toBe(false);
        expect(trash.size).toBe(0);

        execute($cacheStore, store, trash, "2");

        expect(data.has("trash")).toBe(true);
        expect(trash.size).toBe(1);
    });
});