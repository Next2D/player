import { execute } from "./CacheStoreGetService";
import { describe, expect, it } from "vitest";

describe("CacheStoreGetService.js test", () =>
{
    it("test case1", () =>
    {
        const store = new Map();
        expect(execute(store, ["1", "0"])).toBe(null);
    });

    it("test case2", () =>
    {
        const store = new Map();
        store.set("1", new Map());
        expect(execute(store, ["1", "0"])).toBe(null);
    });

    it("test case3", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        store.set("1", data);
        expect(execute(store, ["1", "0"])).toBe("test");
    });
});
