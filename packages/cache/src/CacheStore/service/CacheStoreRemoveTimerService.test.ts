import { execute } from "./CacheStoreRemoveTimerService";
import { execute as cacheStoreGetService } from "./CacheStoreGetService";
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

    it("a cache shared with an object that is still drawn is not discarded", () =>
    {
        const trash = new Map();
        const data = new Map();
        const store = new Map();
        store.set("3", data);

        // 表示オブジェクトが付ける自分の ID の印と、描画キャッシュ
        data.set("3", true);
        data.set("100", "node");

        // 共有している片方がステージから外れる
        execute($cacheStore, store, trash, "3");
        expect(trash.has("3")).toBe(true);

        // 印が外れるので、まだ描かれているもう片方は内側の Map を直接使い続けない
        expect(data.has("3")).toBe(false);
        expect(data.get("100")).toBe("node");

        // 次の描画で CacheStore.get を通ると、削除の予約が取り消される
        expect(cacheStoreGetService($cacheStore, store, trash, "3", "100")).toBe("node");
        expect(trash.has("3")).toBe(false);
        expect(data.has("trash")).toBe(false);
    });
});