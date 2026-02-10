import { describe, it, expect, beforeEach } from "vitest";
import type { ITexturePoolBuckets } from "../../interface/IPooledTexture";
import { execute } from "./TexturePoolReleaseService";

describe("TexturePoolReleaseService", () =>
{
    let buckets: ITexturePoolBuckets;

    beforeEach(() =>
    {
        buckets = new Map();
    });

    it("should release texture back to pool", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry = {
            "texture": mockTexture,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        };
        buckets.set("256_256_rgba8unorm", [entry]);

        execute(buckets, mockTexture, 100);

        expect(entry.inUse).toBe(false);
        expect(entry.lastUsedFrame).toBe(100);
    });

    it("should update lastUsedFrame on release", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry = {
            "texture": mockTexture,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 50
        };
        buckets.set("256_256_rgba8unorm", [entry]);

        execute(buckets, mockTexture, 200);

        expect(entry.lastUsedFrame).toBe(200);
    });

    it("should only release matching texture", () =>
    {
        const texture1 = { "id": 1 } as unknown as GPUTexture;
        const texture2 = { "id": 2 } as unknown as GPUTexture;
        const entry1 = {
            "texture": texture1,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        };
        const entry2 = {
            "texture": texture2,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        };
        buckets.set("256_256_rgba8unorm", [entry1, entry2]);

        execute(buckets, texture1, 100);

        expect(entry1.inUse).toBe(false);
        expect(entry2.inUse).toBe(true);
    });

    it("should handle texture not in pool", () =>
    {
        const unknownTexture = { "id": 999 } as unknown as GPUTexture;

        expect(() => execute(buckets, unknownTexture, 100)).not.toThrow();
    });

    it("should handle empty pool", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;

        expect(() => execute(buckets, mockTexture, 100)).not.toThrow();
    });

    it("should find texture across different buckets", () =>
    {
        const texture1 = { "id": 1 } as unknown as GPUTexture;
        const texture2 = { "id": 2 } as unknown as GPUTexture;
        buckets.set("256_256_rgba8unorm", [{
            "texture": texture1,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        }]);
        buckets.set("512_512_rgba8unorm", [{
            "texture": texture2,
            "width": 512,
            "height": 512,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        }]);

        execute(buckets, texture2, 100);

        expect(buckets.get("256_256_rgba8unorm")![0].inUse).toBe(true);
        expect(buckets.get("512_512_rgba8unorm")![0].inUse).toBe(false);
    });

    it("should stop after finding first match", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry1 = {
            "texture": mockTexture,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        };
        const entry2 = {
            "texture": mockTexture,
            "width": 256,
            "height": 256,
            "format": "rgba8unorm" as GPUTextureFormat,
            "inUse": true,
            "lastUsedFrame": 0
        };
        buckets.set("256_256_rgba8unorm", [entry1, entry2]);

        execute(buckets, mockTexture, 100);

        // Only first matching entry should be released
        expect(entry1.inUse).toBe(false);
    });
});
