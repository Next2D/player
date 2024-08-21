import { execute } from "./CacheStoreHasService";
import { describe, expect, it } from "vitest";

describe("CacheStoreHasService.js test", () =>
{
    it("test case1", () =>
    {
        const store = new Map();
        expect(execute(store, ["1", "0"])).toBe(false);
    });

    it("test case2", () =>
    {
        const store = new Map();
        store.set("1", new Map());
        expect(execute(store, ["1", "0"])).toBe(false);
    });

    it("test case3", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        store.set("1", data);
        expect(execute(store, ["1", "0"])).toBe(true);
    });
});