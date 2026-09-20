import { describe, expect, it, vi } from "vitest";
import { TexturePool } from "./TexturePool";
import { execute as acquire } from "./TexturePool/usecase/TexturePoolAcquireUseCase";
import { execute as release } from "./TexturePool/service/TexturePoolReleaseService";
import { execute as cleanup } from "./TexturePool/service/TexturePoolCleanupService";
import type { IPooledTexture, ITexturePoolBuckets } from "./interface/IPooledTexture";

vi.stubGlobal("GPUTextureUsage", { "TEXTURE_BINDING": 4, "COPY_DST": 2, "RENDER_ATTACHMENT": 16 });

const createDevice = () =>
{
    const textures: GPUTexture[] = [];
    const device = {
        "createTexture": vi.fn(() => {
            const texture = {
                "destroy": vi.fn(),
                get width(): number { throw new Error("Unexpected native width read"); },
                get height(): number { throw new Error("Unexpected native height read"); },
                get format(): GPUTextureFormat { throw new Error("Unexpected native format read"); }
            } as unknown as GPUTexture;
            textures.push(texture);
            return texture;
        })
    };
    return { "device": device as unknown as GPUDevice, textures };
};

describe("texture pool entry index", () =>
{
    it("reuses exact acquisition keys without reading native texture properties", () =>
    {
        const { device } = createDevice();
        const pool = new TexturePool(device);
        const a = pool.acquire(12.5, 19, "rgba8unorm");
        const b = pool.acquire(12.5, 19, "rgba8unorm");
        expect(a === b).toBe(false);
        pool.release(a);
        expect(pool.acquire(12.5, 19, "rgba8unorm") === a).toBe(true);
        pool.release(b);
        expect(pool.acquire(12.5, 19, "bgra8unorm") === b).toBe(false);
        pool.dispose();
    });

    it("does not release another pool's texture and starts fresh after dispose", () =>
    {
        const { device, textures } = createDevice();
        const a = new TexturePool(device), b = new TexturePool(device);
        const first = a.acquire(16, 16);
        b.release(first);
        expect(a.acquire(16, 16) === first).toBe(false);
        a.release(first);
        a.dispose();
        for (const texture of textures) expect(texture.destroy).toHaveBeenCalledOnce();
        a.release(first);
        expect(a.acquire(16, 16) === first).toBe(false);
        a.dispose();
        b.dispose();
    });

    it("removes LRU entries from both ownership structures and ignores later releases", () =>
    {
        const { device } = createDevice();
        const buckets: ITexturePoolBuckets = new Map();
        const entries = new WeakMap<GPUTexture, IPooledTexture>();
        const count = [0];
        const get = (width: number, frame: number) => acquire(device, buckets, width, 16, "rgba8unorm", 20, frame, 2, count, entries);
        const first = get(16, 1), second = get(32, 1);
        release(buckets, first, 2, entries);
        release(buckets, second, 3, entries);
        const third = get(64, 4);
        expect(first.destroy).toHaveBeenCalledOnce();
        expect(second.destroy).not.toHaveBeenCalled();
        expect(entries.has(first)).toBe(false);
        expect(entries.has(third)).toBe(true);
        expect(count[0]).toBe(2);
        const secondEntry = entries.get(second)!;
        const state = { ...secondEntry };
        release(buckets, first, 1000, entries);
        expect(secondEntry).toEqual(state);
        expect(count[0]).toBe(2);
    });

    it("cleans only expired unused entries and preserves the pool's frame-based timing", () =>
    {
        const { device } = createDevice();
        const buckets: ITexturePoolBuckets = new Map();
        const entries = new WeakMap<GPUTexture, IPooledTexture>();
        const count = [0];
        const get = (width: number) => acquire(device, buckets, width, 16, "rgba8unorm", 20, 1, 32, count, entries);
        const old = get(16), boundary = get(32), busy = get(64);
        release(buckets, old, 19, entries);
        release(buckets, boundary, 20, entries);
        cleanup(buckets, 200, 180, count, entries);
        expect(old.destroy).toHaveBeenCalledOnce();
        expect(entries.has(old)).toBe(false);
        expect(entries.has(boundary)).toBe(true);
        expect(entries.has(busy)).toBe(true);
        expect(count[0]).toBe(2);
        release(buckets, boundary, 201, entries);
        cleanup(buckets, 381, 180, count, entries);
        expect(entries.has(boundary)).toBe(true);
        cleanup(buckets, 382, 180, count, entries);
        expect(entries.has(boundary)).toBe(false);
        expect(count[0]).toBe(1);
    });

    it("indexes an unregistered bucket entry on the fallback path", () =>
    {
        const { device } = createDevice();
        const buckets: ITexturePoolBuckets = new Map();
        const entries = new WeakMap<GPUTexture, IPooledTexture>();
        const count = [0];
        const texture = acquire(device, buckets, 16, 16, "rgba8unorm", 20, 1, 32, count);
        expect(entries.has(texture)).toBe(false);
        release(buckets, texture, 2, entries);
        const entry = buckets.get("16_16_rgba8unorm")![0];
        expect(entries.get(texture)).toBe(entry);
        const iterate = vi.spyOn(buckets, "values");
        release(buckets, texture, 3, entries);
        expect(iterate).not.toHaveBeenCalled();
        expect(entry.lastUsedFrame).toBe(3);
    });
});
