import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledTexture } from "../interface/IPooledTexture";
import { execute } from "./TexturePoolCleanupService";

describe("TexturePoolCleanupService", () =>
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

    it("should remove old unused entries", () =>
    {
        const old = createMockEntry(10, false);
        const recent = createMockEntry(90, false);
        pool.push(old, recent);

        execute(pool, 100, 50);

        expect(pool.length).toBe(1);
        expect(pool[0]).toBe(recent);
        expect(old.texture.destroy).toHaveBeenCalled();
    });

    it("should keep entries that are in use even if old", () =>
    {
        const oldInUse = createMockEntry(10, true);
        const oldNotInUse = createMockEntry(10, false);
        pool.push(oldInUse, oldNotInUse);

        execute(pool, 100, 50);

        expect(pool.length).toBe(1);
        expect(pool[0]).toBe(oldInUse);
        expect(oldInUse.texture.destroy).not.toHaveBeenCalled();
        expect(oldNotInUse.texture.destroy).toHaveBeenCalled();
    });

    it("should handle empty pool", () =>
    {
        expect(() => execute(pool, 100, 50)).not.toThrow();
        expect(pool.length).toBe(0);
    });

    it("should remove all old unused entries", () =>
    {
        pool.push(
            createMockEntry(0, false),
            createMockEntry(10, false),
            createMockEntry(20, false)
        );

        execute(pool, 100, 30);

        expect(pool.length).toBe(0);
    });

    it("should keep recent unused entries", () =>
    {
        const recent1 = createMockEntry(80, false);
        const recent2 = createMockEntry(90, false);
        pool.push(recent1, recent2);

        execute(pool, 100, 50);

        expect(pool.length).toBe(2);
        expect(recent1.texture.destroy).not.toHaveBeenCalled();
        expect(recent2.texture.destroy).not.toHaveBeenCalled();
    });

    it("should call destroy on removed textures", () =>
    {
        const entry = createMockEntry(10, false);
        pool.push(entry);

        execute(pool, 100, 50);

        expect(entry.texture.destroy).toHaveBeenCalledTimes(1);
    });

    it("should handle mixed pool correctly", () =>
    {
        const oldUnused = createMockEntry(10, false);
        const oldInUse = createMockEntry(10, true);
        const recentUnused = createMockEntry(90, false);
        const recentInUse = createMockEntry(90, true);
        pool.push(oldUnused, oldInUse, recentUnused, recentInUse);

        execute(pool, 100, 50);

        expect(pool.length).toBe(3);
        expect(pool).not.toContain(oldUnused);
        expect(pool).toContain(oldInUse);
        expect(pool).toContain(recentUnused);
        expect(pool).toContain(recentInUse);
    });
});
