import { execute } from "./CacheStoreRemoveTimerScheduledCacheService";
import { describe, expect, it } from "vitest";
import { $cacheStore } from "../..";

describe("CacheStoreRemoveTimerScheduledCacheService.js test", () =>
{
    it("test case1", () =>
    {
        const data = new Map();
        data.set("trash", true);

        const trash = new Map();
        trash.set("2", data);

        $cacheStore.$removeIds.length = 0;
        $cacheStore.$removeCache = true;
        expect($cacheStore.$removeIds.length).toBe(0);
        expect($cacheStore.$removeCache).toBe(true);
        expect(trash.size).toBe(1);

        execute($cacheStore, trash);

        expect($cacheStore.$removeIds.length).toBe(1);
        expect($cacheStore.$removeCache).toBe(false);
        expect(trash.size).toBe(0);
    });
});