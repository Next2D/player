import { execute } from "./BufferManagerCleanupStorageBuffersUseCase";
import { describe, expect, it, vi } from "vitest";

describe("BufferManagerCleanupStorageBuffersUseCase.js test", () => {

    it("execute test case1 - should remove old unused buffers", () =>
    {
        const destroyFn = vi.fn();
        const pool = [
            { "buffer": { "destroy": destroyFn }, "inUse": false, "lastUsedFrame": 0, "size": 256 },
            { "buffer": { "destroy": vi.fn() }, "inUse": true, "lastUsedFrame": 0, "size": 256 },
            { "buffer": { "destroy": vi.fn() }, "inUse": false, "lastUsedFrame": 50, "size": 256 }
        ] as any;

        execute(pool, 100, 60);

        expect(pool.length).toBe(2);
        expect(destroyFn).toHaveBeenCalledTimes(1);
    });

    it("execute test case2 - should not remove in-use buffers", () =>
    {
        const pool = [
            { "buffer": { "destroy": vi.fn() }, "inUse": true, "lastUsedFrame": 0, "size": 256 },
            { "buffer": { "destroy": vi.fn() }, "inUse": true, "lastUsedFrame": 10, "size": 256 }
        ] as any;

        execute(pool, 100, 60);

        expect(pool.length).toBe(2);
    });

    it("execute test case3 - should not remove recently used buffers", () =>
    {
        const pool = [
            { "buffer": { "destroy": vi.fn() }, "inUse": false, "lastUsedFrame": 95, "size": 256 }
        ] as any;

        execute(pool, 100, 60);

        expect(pool.length).toBe(1);
    });

    it("execute test case4 - empty pool", () =>
    {
        const pool: any[] = [];
        execute(pool, 100, 60);
        expect(pool.length).toBe(0);
    });

    it("execute test case5 - default max_age", () =>
    {
        const destroyFn = vi.fn();
        const pool = [
            { "buffer": { "destroy": destroyFn }, "inUse": false, "lastUsedFrame": 0, "size": 256 }
        ] as any;

        execute(pool, 61);

        expect(pool.length).toBe(0);
        expect(destroyFn).toHaveBeenCalledTimes(1);
    });
});
