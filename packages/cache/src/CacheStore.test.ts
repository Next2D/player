import { CacheStore } from "./CacheStore";
import { describe, expect, it, vi } from "vitest";

describe("CacheStore trash flow integration", () =>
{
    it("removeTimer -> get -> removeTimerScheduledCache should still delete the entry", () =>
    {
        vi.useFakeTimers();

        const store = new CacheStore();
        store.set("12345", "0", { "value": "old" });

        expect(store.has("12345", "0")).toBe(true);

        // removeTimer で削除予定に登録
        store.removeTimer("12345");
        expect((store as any)["_$trash"].has("12345")).toBe(true);

        // タイマー発火前に get が呼ばれても、削除予定は維持されない＝
        // 削除予定をキャンセルし、再度キャッシュとして有効化する
        const value = store.get("12345", "0");
        expect(value).toEqual({ "value": "old" });
        expect((store as any)["_$trash"].has("12345")).toBe(false);

        // タイマー発火 (1 秒経過)
        vi.advanceTimersByTime(1000);
        expect(store.$removeCache).toBe(true);

        // get でキャンセルされたので removeTimerScheduledCache は何も削除しない
        store.removeTimerScheduledCache();
        expect(store.has("12345", "0")).toBe(true);
        expect(store.$removeIds.length).toBe(0);

        vi.useRealTimers();
    });

    it("removeTimer -> (no get) -> removeTimerScheduledCache should delete the entry and push removeIds", () =>
    {
        vi.useFakeTimers();

        const store = new CacheStore();
        store.$removeIds.length = 0;
        store.set("67890", "0", { "value": "stale" });

        store.removeTimer("67890");
        expect((store as any)["_$trash"].has("67890")).toBe(true);

        vi.advanceTimersByTime(1000);
        expect(store.$removeCache).toBe(true);

        store.removeTimerScheduledCache();

        // 実際に削除されている
        expect(store.has("67890", "0")).toBe(false);
        expect(store.$removeIds).toContain(67890);
        expect((store as any)["_$trash"].size).toBe(0);

        vi.useRealTimers();
    });

    it("get on an entry not in trash_store should not affect trash_store of other entries", () =>
    {
        vi.useFakeTimers();

        const store = new CacheStore();
        store.set("aaa", "0", "alive");
        store.set("bbb", "0", "doomed");

        store.removeTimer("bbb");
        expect((store as any)["_$trash"].has("bbb")).toBe(true);

        // 別エントリへの get は他エントリの削除予定に影響を与えない
        expect(store.get("aaa", "0")).toBe("alive");
        expect((store as any)["_$trash"].has("bbb")).toBe(true);

        vi.useRealTimers();
    });

    it("LRU: 上限超過で最も古いIDがevictされ$removeIdsへ通知される", () =>
    {
        const store = new CacheStore();
        store.$maxStoreSize = 2;

        store.set("100", "0", true);
        store.set("200", "0", true);

        // "100" を参照して最新化
        expect(store.get("100", "0")).toBe(true);

        // 追加で "200" が最古になり evict される
        store.set("300", "0", true);

        expect(store.has("100")).toBe(true);
        expect(store.has("200")).toBe(false);
        expect(store.has("300")).toBe(true);
        expect(store.$removeIds).toContain(200);
    });

    it("LRU: 上限0(デフォルト)ではevictされない", () =>
    {
        const store = new CacheStore();

        for (let idx = 1; idx <= 10; ++idx) {
            store.set(`${idx}`, "0", true);
        }

        for (let idx = 1; idx <= 10; ++idx) {
            expect(store.has(`${idx}`)).toBe(true);
        }
        expect(store.$removeIds.length).toBe(0);
    });
});
