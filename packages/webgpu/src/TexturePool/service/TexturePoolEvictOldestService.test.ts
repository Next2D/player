import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledTexture } from "../interface/IPooledTexture";
import { execute } from "./TexturePoolEvictOldestService";

describe("TexturePoolEvictOldestService", () =>
{
    let pool: IPooledTexture[];

    const createMockEntry = (
        lastUsedFrame: number,
        inUse: boolean = false
    ): IPooledTexture => ({
        "texture": {
            "destroy": vi.fn()
        } as unknown as GPUTexture,
        "width": 256,
        "height": 256,
        "format": "rgba8unorm" as GPUTextureFormat,
        inUse,
        lastUsedFrame
    });

    beforeEach(() =>
    {
        pool = [];
    });

    it("should evict the oldest unused entry", () =>
    {
        const oldest = createMockEntry(10, false);
        const middle = createMockEntry(50, false);
        const recent = createMockEntry(100, false);
        pool.push(oldest, middle, recent);

        execute(pool);

        expect(pool.length).toBe(2);
        expect(pool).not.toContain(oldest);
        expect(oldest.texture.destroy).toHaveBeenCalled();
    });

    it("should skip entries that are in use", () =>
    {
        const oldestInUse = createMockEntry(10, true);
        const oldestNotInUse = createMockEntry(50, false);
        pool.push(oldestInUse, oldestNotInUse);

        execute(pool);

        expect(pool.length).toBe(1);
        expect(pool[0]).toBe(oldestInUse);
        expect(oldestInUse.texture.destroy).not.toHaveBeenCalled();
        expect(oldestNotInUse.texture.destroy).toHaveBeenCalled();
    });

    it("should handle empty pool", () =>
    {
        expect(() => execute(pool)).not.toThrow();
        expect(pool.length).toBe(0);
    });

    it("should not evict anything if all entries are in use", () =>
    {
        pool.push(
            createMockEntry(10, true),
            createMockEntry(50, true),
            createMockEntry(100, true)
        );

        execute(pool);

        expect(pool.length).toBe(3);
    });

    it("should only evict one entry per call", () =>
    {
        pool.push(
            createMockEntry(10, false),
            createMockEntry(20, false),
            createMockEntry(30, false)
        );

        execute(pool);
        expect(pool.length).toBe(2);

        execute(pool);
        expect(pool.length).toBe(1);
    });

    it("should call destroy on evicted texture", () =>
    {
        const entry = createMockEntry(10, false);
        pool.push(entry);

        execute(pool);

        expect(entry.texture.destroy).toHaveBeenCalledTimes(1);
    });

    it("should correctly identify oldest among multiple unused", () =>
    {
        const recent = createMockEntry(100, false);
        const oldest = createMockEntry(5, false);
        const middle = createMockEntry(50, false);
        pool.push(recent, oldest, middle);

        execute(pool);

        expect(pool.length).toBe(2);
        expect(pool).not.toContain(oldest);
        expect(pool).toContain(recent);
        expect(pool).toContain(middle);
    });
});
