import { execute } from "./CommandRemoveCacheService";
import { describe, expect, it, vi } from "vitest";

vi.mock("@next2d/cache", () => {
    const store = new Map<string, Map<string, any>>();
    return {
        "$cacheStore": {
            "has": vi.fn((key: string) => store.has(key)),
            "getById": vi.fn((key: string) => store.get(key)),
            "removeById": vi.fn((key: string) => store.delete(key)),
            "_store": store
        }
    };
});

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "removeNode": vi.fn()
    }
}));

describe("CommandRemoveCacheService.js test", () => {

    it("execute test case1 - remove existing cache entries", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const { $context } = await import("../../RendererUtil");

        const node1 = { "id": 1 };
        const node2 = { "id": 2 };
        const cache = new Map();
        cache.set("a", node1);
        cache.set("b", node2);

        ($cacheStore as any)._store.set("1", cache);

        const keys = new Float32Array([1]);
        execute(keys);

        expect($cacheStore.has).toHaveBeenCalledWith("1");
        expect($cacheStore.getById).toHaveBeenCalledWith("1");
        expect($context.removeNode).toHaveBeenCalledTimes(2);
        expect($cacheStore.removeById).toHaveBeenCalledWith("1");
    });

    it("execute test case2 - skip non-existing cache keys", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");

        vi.mocked($cacheStore.has).mockReturnValue(false as any);

        const keys = new Float32Array([999]);
        execute(keys);

        expect($cacheStore.has).toHaveBeenCalledWith("999");
        expect($cacheStore.getById).not.toHaveBeenCalledWith("999");
    });

    it("execute test case3 - empty keys array", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");

        vi.mocked($cacheStore.has).mockClear();

        const keys = new Float32Array([]);
        execute(keys);

        expect($cacheStore.has).not.toHaveBeenCalled();
    });
});
