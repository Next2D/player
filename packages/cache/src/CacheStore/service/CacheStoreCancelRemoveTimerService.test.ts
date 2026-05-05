import { execute } from "./CacheStoreCancelRemoveTimerService";
import { describe, expect, it } from "vitest";

describe("CacheStoreCancelRemoveTimerService.js test", () =>
{
    it("test case1: trash_storeにidが存在しない場合は何もしない", () =>
    {
        const data = new Map();
        const store = new Map();
        store.set("2", data);
        const trash = new Map();

        execute(store, trash, "2");

        expect(trash.size).toBe(0);
        expect(data.has("trash")).toBe(false);
    });

    it("test case2: trash_storeにidが存在する場合はtrash_storeから削除し、data_storeのtrashキーも削除する", () =>
    {
        const data = new Map();
        data.set("trash", true);

        const store = new Map();
        store.set("2", data);

        const trash = new Map();
        trash.set("2", data);

        expect(trash.size).toBe(1);
        expect(data.has("trash")).toBe(true);

        execute(store, trash, "2");

        expect(trash.size).toBe(0);
        expect(data.has("trash")).toBe(false);
    });

    it("test case3: trash_storeにidが存在するがdata_storeにidが存在しない場合はtrash_storeのみ削除する", () =>
    {
        const store = new Map();
        const trash = new Map();
        trash.set("2", new Map());

        expect(trash.size).toBe(1);

        execute(store, trash, "2");

        expect(trash.size).toBe(0);
    });
});
