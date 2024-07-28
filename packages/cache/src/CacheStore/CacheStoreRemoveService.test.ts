import { execute } from "./CacheStoreRemoveService";
import { describe, expect, it } from "vitest";

describe("CacheStoreRemoveService.js test", () =>
{
    it("test case1", () =>
    {
        const data = new Map();
        data.set("0", "test");

        const store = new Map();
        store.set("1", data);

        expect(data.size).toBe(1);
        expect(store.size).toBe(1);

        execute(store, "1", "0");

        expect(data.size).toBe(0);
        expect(store.size).toBe(0);
    });
});