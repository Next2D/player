import { execute } from "./CacheStoreEvictOverLimitService";
import { CacheStore } from "../../CacheStore";
import { describe, expect, it } from "vitest";

describe("CacheStoreEvictOverLimitService.js test", () =>
{
    it("test case1: evicts the least recently used IDs beyond the limit", () =>
    {
        const store = new CacheStore();
        store.$maxStoreSize = 2;

        store.set("100", "0", true);
        store.set("200", "0", true);
        store.set("300", "0", true);
        expect(store.$overLimit).toBe(true);

        // 削除は set の中では行われない
        expect(store.has("100")).toBe(true);
        expect(store.$removeIds.length).toBe(0);

        execute(store, (store as any)["_$store"]);

        expect(store.$overLimit).toBe(false);
        expect(store.has("100")).toBe(false);
        expect(store.has("200")).toBe(true);
        expect(store.has("300")).toBe(true);
        expect(store.$removeIds).toEqual([100]);
    });

    it("test case2: does nothing when the limit is not set", () =>
    {
        const store = new CacheStore();

        store.set("100", "0", true);
        store.set("200", "0", true);

        execute(store, (store as any)["_$store"]);

        expect(store.has("100")).toBe(true);
        expect(store.has("200")).toBe(true);
        expect(store.$removeIds.length).toBe(0);
    });

    it("test case3: an ID recreated before the eviction is not removed afterwards", () =>
    {
        // 描画情報の生成中に、上限を超えたうえで古いIDを作り直す(参照し直す)場合
        const store = new CacheStore();
        store.$maxStoreSize = 2;

        store.set("100", "0", true);
        store.set("200", "0", true);

        // 新しいIDが 2 つ増えて上限を超える。このあと最古の "100" をもう一度使う
        store.set("300", "0", true);
        store.set("400", "0", true);
        store.set("100", "0", true);

        execute(store, (store as any)["_$store"]);

        // 直前に使った "100" は残り、削除の通知にも含まれない
        expect(store.has("100")).toBe(true);
        expect(store.$removeIds).not.toContain(100);
        expect(store.$removeIds).toEqual([200, 300]);
    });
});
