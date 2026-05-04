import { execute } from "./CacheStoreGetService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGetService.js test", () =>
{
    it("test case1", () =>
    {
        const store = new Map();
        const trash = new Map();
        expect(execute(store, trash, "1", "0")).toBe(null);
    });

    it("test case2", () =>
    {
        const store = new Map();
        const trash = new Map();
        store.set("1", new Map());
        expect(execute(store, trash, "1", "0")).toBe(null);
    });

    it("test case3", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        const trash = new Map();
        store.set("1", data);
        expect(execute(store, trash, "1", "0")).toBe("test");
    });

    it("get should cancel pending deletion when entry is in trash_store", () =>
    {
        const data = new Map();
        data.set("0", "test");
        data.set("trash", true);

        const store = new Map();
        store.set("1", data);

        const trash = new Map();
        trash.set("1", data);

        expect(trash.has("1")).toBe(true);
        expect(data.has("trash")).toBe(true);

        const result = execute(store, trash, "1", "0");

        // 値は問題なく取得できる
        expect(result).toBe("test");

        // 削除予定はキャンセルされる
        expect(trash.has("1")).toBe(false);
        expect(data.has("trash")).toBe(false);

        // 元データは削除されていない
        expect(store.has("1")).toBe(true);
        expect(data.get("0")).toBe("test");
    });

    it("get should not touch trash_store for entries that are not pending deletion", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const otherData = new Map();
        otherData.set("trash", true);

        const store = new Map();
        store.set("1", data);

        const trash = new Map();
        trash.set("2", otherData);

        // 別 id のエントリへの get は trash_store を触らない
        execute(store, trash, "1", "0");

        expect(trash.has("2")).toBe(true);
        expect(otherData.has("trash")).toBe(true);
    });
});
