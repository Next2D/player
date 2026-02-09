import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ITexturePoolBuckets } from "../../interface/IPooledTexture";
import { execute } from "./TexturePoolAcquireUseCase";

describe("TexturePoolAcquireUseCase", () =>
{
    let buckets: ITexturePoolBuckets;
    let totalCount: number[];

    const createMockDevice = () =>
    {
        let textureId = 0;
        return {
            "createTexture": vi.fn((descriptor) => ({
                "id": ++textureId,
                "width": descriptor.size.width,
                "height": descriptor.size.height,
                "format": descriptor.format,
                "destroy": vi.fn()
            }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        buckets = new Map();
        totalCount = [0];
    });

    describe("pool matching", () =>
    {
        it("should return exact match from bucket", () =>
        {
            const mockTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            buckets.set("256_256_rgba8unorm", [{
                "texture": mockTexture,
                "width": 256,
                "height": 256,
                "format": "rgba8unorm" as GPUTextureFormat,
                "inUse": false,
                "lastUsedFrame": 0
            }]);
            totalCount[0] = 1;
            const device = createMockDevice();

            const result = execute(device, buckets, 256, 256, "rgba8unorm", 0, 100, 32, totalCount);

            expect(result).toBe(mockTexture);
            expect(device.createTexture).not.toHaveBeenCalled();
        });

        it("should skip entries that are in use", () =>
        {
            const inUseTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            const availableTexture = { "id": 2, "destroy": vi.fn() } as unknown as GPUTexture;
            buckets.set("256_256_rgba8unorm", [
                {
                    "texture": inUseTexture,
                    "width": 256,
                    "height": 256,
                    "format": "rgba8unorm" as GPUTextureFormat,
                    "inUse": true,
                    "lastUsedFrame": 0
                },
                {
                    "texture": availableTexture,
                    "width": 256,
                    "height": 256,
                    "format": "rgba8unorm" as GPUTextureFormat,
                    "inUse": false,
                    "lastUsedFrame": 0
                }
            ]);
            totalCount[0] = 2;
            const device = createMockDevice();

            const result = execute(device, buckets, 256, 256, "rgba8unorm", 0, 100, 32, totalCount);

            expect(result).toBe(availableTexture);
        });

        it("should skip entries with different format (different bucket)", () =>
        {
            const wrongFormatTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            buckets.set("256_256_bgra8unorm", [{
                "texture": wrongFormatTexture,
                "width": 256,
                "height": 256,
                "format": "bgra8unorm" as GPUTextureFormat,
                "inUse": false,
                "lastUsedFrame": 0
            }]);
            totalCount[0] = 1;
            const device = createMockDevice();

            execute(device, buckets, 256, 256, "rgba8unorm", 0, 100, 32, totalCount);

            expect(device.createTexture).toHaveBeenCalled();
        });

        it("should not match different sizes (different bucket)", () =>
        {
            const device = createMockDevice();
            const mockTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            buckets.set("256_256_rgba8unorm", [{
                "texture": mockTexture,
                "width": 256,
                "height": 256,
                "format": "rgba8unorm" as GPUTextureFormat,
                "inUse": false,
                "lastUsedFrame": 0
            }]);
            totalCount[0] = 1;

            // 200x200 は 256_256 バケットに入らない → 新規作成
            execute(device, buckets, 200, 200, "rgba8unorm", 0, 100, 32, totalCount);

            expect(device.createTexture).toHaveBeenCalled();
            expect(totalCount[0]).toBe(2);
        });
    });

    describe("bucket map structure", () =>
    {
        it("should use exact size as bucket key", () =>
        {
            const device = createMockDevice();

            execute(device, buckets, 200, 150, "rgba8unorm", 0x10, 100, 32, totalCount);

            expect(device.createTexture).toHaveBeenCalledWith({
                "size": { "width": 200, "height": 150 },
                "format": "rgba8unorm",
                "usage": 0x10
            });
            expect(buckets.has("200_150_rgba8unorm")).toBe(true);
        });

        it("should reuse same-size texture from bucket", () =>
        {
            const device = createMockDevice();

            const tex1 = execute(device, buckets, 200, 150, "rgba8unorm", 0x10, 100, 32, totalCount);
            expect(device.createTexture).toHaveBeenCalledTimes(1);

            // テクスチャを返却
            const bucket = buckets.get("200_150_rgba8unorm")!;
            bucket[0].inUse = false;

            // 同じサイズを要求 → キャッシュヒット
            const tex2 = execute(device, buckets, 200, 150, "rgba8unorm", 0x10, 200, 32, totalCount);
            expect(device.createTexture).toHaveBeenCalledTimes(1);
            expect(tex2).toBe(tex1);
        });
    });

    describe("texture creation", () =>
    {
        it("should create new texture when pool is empty", () =>
        {
            const device = createMockDevice();

            execute(device, buckets, 256, 256, "rgba8unorm", 0x10, 100, 32, totalCount);

            expect(device.createTexture).toHaveBeenCalledWith({
                "size": { "width": 256, "height": 256 },
                "format": "rgba8unorm",
                "usage": 0x10
            });
        });

        it("should add new texture to bucket", () =>
        {
            const device = createMockDevice();

            execute(device, buckets, 256, 256, "rgba8unorm", 0, 100, 32, totalCount);

            const bucket = buckets.get("256_256_rgba8unorm");
            expect(bucket).toBeDefined();
            expect(bucket!.length).toBe(1);
            expect(bucket![0].width).toBe(256);
            expect(bucket![0].height).toBe(256);
            expect(bucket![0].inUse).toBe(true);
            expect(bucket![0].lastUsedFrame).toBe(100);
            expect(totalCount[0]).toBe(1);
        });

        it("should evict oldest (LRU) when pool is full", () =>
        {
            const device = createMockDevice();

            // Fill pool with maxPoolSize entries (各異なるバケット)
            for (let i = 0; i < 4; i++) {
                const size = 100 + i * 50; // 100, 150, 200, 250
                execute(device, buckets, size, size, "rgba8unorm", 0, i, 4, totalCount);
                // 返却してavailableにする
                for (const bucket of buckets.values()) {
                    for (const entry of bucket) {
                        entry.inUse = false;
                    }
                }
            }
            expect(totalCount[0]).toBe(4);

            // 新しいサイズを要求 → 最も古いもの（frame=0）が削除される
            execute(device, buckets, 300, 300, "rgba8unorm", 0, 100, 4, totalCount);

            expect(totalCount[0]).toBe(4); // 1個削除 + 1個追加
            // frame=0のエントリ（100x100）が削除されたはず
            expect(buckets.has("100_100_rgba8unorm")).toBe(false);
        });
    });

    describe("frame tracking", () =>
    {
        it("should update lastUsedFrame when acquiring from pool", () =>
        {
            const mockTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            const entry = {
                "texture": mockTexture,
                "width": 256,
                "height": 256,
                "format": "rgba8unorm" as GPUTextureFormat,
                "inUse": false,
                "lastUsedFrame": 50
            };
            buckets.set("256_256_rgba8unorm", [entry]);
            totalCount[0] = 1;
            const device = createMockDevice();

            execute(device, buckets, 256, 256, "rgba8unorm", 0, 200, 32, totalCount);

            expect(entry.lastUsedFrame).toBe(200);
        });

        it("should mark texture as in use", () =>
        {
            const mockTexture = { "id": 1, "destroy": vi.fn() } as unknown as GPUTexture;
            const entry = {
                "texture": mockTexture,
                "width": 256,
                "height": 256,
                "format": "rgba8unorm" as GPUTextureFormat,
                "inUse": false,
                "lastUsedFrame": 0
            };
            buckets.set("256_256_rgba8unorm", [entry]);
            totalCount[0] = 1;
            const device = createMockDevice();

            execute(device, buckets, 256, 256, "rgba8unorm", 0, 100, 32, totalCount);

            expect(entry.inUse).toBe(true);
        });
    });
});
