import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledTexture, ITexturePoolBuckets } from "../../interface/IPooledTexture";
import { execute } from "./TexturePoolCleanupService";

describe("TexturePoolCleanupService", () =>
{
    let buckets: ITexturePoolBuckets;
    let totalCount: number[];

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
        buckets = new Map();
        totalCount = [0];
    });

    it("should remove old unused entries", () =>
    {
        const old = createMockEntry(10, false);
        const recent = createMockEntry(90, false);
        buckets.set("256_256_rgba8unorm", [old, recent]);
        totalCount[0] = 2;

        execute(buckets, 100, 50, totalCount);

        const bucket = buckets.get("256_256_rgba8unorm")!;
        expect(bucket.length).toBe(1);
        expect(bucket[0]).toBe(recent);
        expect(old.texture.destroy).toHaveBeenCalled();
        expect(totalCount[0]).toBe(1);
    });

    it("should keep entries that are in use even if old", () =>
    {
        const oldInUse = createMockEntry(10, true);
        const oldNotInUse = createMockEntry(10, false);
        buckets.set("256_256_rgba8unorm", [oldInUse, oldNotInUse]);
        totalCount[0] = 2;

        execute(buckets, 100, 50, totalCount);

        const bucket = buckets.get("256_256_rgba8unorm")!;
        expect(bucket.length).toBe(1);
        expect(bucket[0]).toBe(oldInUse);
        expect(oldInUse.texture.destroy).not.toHaveBeenCalled();
        expect(oldNotInUse.texture.destroy).toHaveBeenCalled();
        expect(totalCount[0]).toBe(1);
    });

    it("should handle empty pool", () =>
    {
        expect(() => execute(buckets, 100, 50, totalCount)).not.toThrow();
        expect(buckets.size).toBe(0);
    });

    it("should remove all old unused entries and delete empty bucket", () =>
    {
        buckets.set("256_256_rgba8unorm", [
            createMockEntry(0, false),
            createMockEntry(10, false),
            createMockEntry(20, false)
        ]);
        totalCount[0] = 3;

        execute(buckets, 100, 30, totalCount);

        expect(buckets.has("256_256_rgba8unorm")).toBe(false);
        expect(totalCount[0]).toBe(0);
    });

    it("should keep recent unused entries", () =>
    {
        const recent1 = createMockEntry(80, false);
        const recent2 = createMockEntry(90, false);
        buckets.set("256_256_rgba8unorm", [recent1, recent2]);
        totalCount[0] = 2;

        execute(buckets, 100, 50, totalCount);

        const bucket = buckets.get("256_256_rgba8unorm")!;
        expect(bucket.length).toBe(2);
        expect(recent1.texture.destroy).not.toHaveBeenCalled();
        expect(recent2.texture.destroy).not.toHaveBeenCalled();
        expect(totalCount[0]).toBe(2);
    });

    it("should call destroy on removed textures", () =>
    {
        const entry = createMockEntry(10, false);
        buckets.set("256_256_rgba8unorm", [entry]);
        totalCount[0] = 1;

        execute(buckets, 100, 50, totalCount);

        expect(entry.texture.destroy).toHaveBeenCalledTimes(1);
    });

    it("should handle mixed pool across buckets correctly", () =>
    {
        const oldUnused = createMockEntry(10, false);
        const oldInUse = createMockEntry(10, true);
        const recentUnused = createMockEntry(90, false);
        const recentInUse = createMockEntry(90, true);

        buckets.set("256_256_rgba8unorm", [oldUnused, oldInUse]);
        buckets.set("512_512_rgba8unorm", [recentUnused, recentInUse]);
        totalCount[0] = 4;

        execute(buckets, 100, 50, totalCount);

        const bucket256 = buckets.get("256_256_rgba8unorm")!;
        const bucket512 = buckets.get("512_512_rgba8unorm")!;
        expect(bucket256.length).toBe(1);
        expect(bucket256[0]).toBe(oldInUse);
        expect(bucket512.length).toBe(2);
        expect(totalCount[0]).toBe(3);
    });
});
