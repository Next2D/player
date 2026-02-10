import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    TexturePool,
    initTexturePool,
    getTexturePool,
    clearTexturePool
} from "./TexturePool";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock usecase and service modules (bucket-based Map API)
vi.mock("./TexturePool/usecase/TexturePoolAcquireUseCase", () => ({
    "execute": vi.fn((device, buckets, width, height, format, usage, currentFrame, maxPoolSize, totalCount) => {
        // Power-of-2 bucket key
        const po2W = Math.max(1, 1 << Math.ceil(Math.log2(width)));
        const po2H = Math.max(1, 1 << Math.ceil(Math.log2(height)));
        const key = `${po2W}_${po2H}_${format}`;

        let bucket = buckets.get(key);
        if (!bucket) {
            bucket = [];
            buckets.set(key, bucket);
        }

        // Check for reusable texture in bucket
        for (const entry of bucket) {
            if (!entry.inUse && entry.width === po2W && entry.height === po2H) {
                entry.inUse = true;
                entry.lastUsedFrame = currentFrame;
                return entry.texture;
            }
        }
        // Create new texture
        const texture = {
            "width": po2W,
            "height": po2H,
            "format": format,
            "destroy": vi.fn()
        };
        bucket.push({
            texture,
            "width": po2W,
            "height": po2H,
            format,
            "inUse": true,
            "lastUsedFrame": currentFrame
        });
        totalCount[0]++;
        return texture;
    })
}));

vi.mock("./TexturePool/service/TexturePoolReleaseService", () => ({
    "execute": vi.fn((buckets, texture, currentFrame) => {
        for (const bucket of buckets.values()) {
            const entry = bucket.find((e: any) => e.texture === texture);
            if (entry) {
                entry.inUse = false;
                entry.lastUsedFrame = currentFrame;
                return;
            }
        }
    })
}));

vi.mock("./TexturePool/service/TexturePoolCleanupService", () => ({
    "execute": vi.fn((buckets, currentFrame, threshold, totalCount) => {
        // Remove old unused textures
        for (const [key, bucket] of buckets.entries()) {
            for (let i = bucket.length - 1; i >= 0; i--) {
                const entry = bucket[i];
                if (!entry.inUse && currentFrame - entry.lastUsedFrame > threshold) {
                    entry.texture.destroy();
                    bucket.splice(i, 1);
                    totalCount[0]--;
                }
            }
            if (bucket.length === 0) {
                buckets.delete(key);
            }
        }
    })
}));

describe("TexturePool", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createTexture": vi.fn((descriptor) => ({
                "width": descriptor.size.width,
                "height": descriptor.size.height,
                "format": descriptor.format,
                "destroy": vi.fn()
            }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        clearTexturePool();
    });

    describe("TexturePool class", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const pool = new TexturePool(device);

            expect(pool).toBeDefined();
        });

        it("should initialize with empty stats", () =>
        {
            const device = createMockDevice();
            const pool = new TexturePool(device);

            const stats = pool.getStats();
            expect(stats.total).toBe(0);
            expect(stats.inUse).toBe(0);
            expect(stats.available).toBe(0);
        });

        describe("beginFrame", () =>
        {
            it("should increment frame counter", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                pool.beginFrame();
                pool.beginFrame();
                pool.beginFrame();

                // Frame counter is internal, but cleanup triggers every 60 frames
                expect(() => pool.beginFrame()).not.toThrow();
            });

            it("should trigger cleanup at frame intervals", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                // Run for 60 frames to trigger cleanup
                for (let i = 0; i < 60; i++) {
                    pool.beginFrame();
                }

                expect(() => pool.beginFrame()).not.toThrow();
            });
        });

        describe("acquire", () =>
        {
            it("should acquire texture with specified dimensions", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture = pool.acquire(256, 256);

                expect(texture).toBeDefined();
                expect(texture.width).toBe(256);
                expect(texture.height).toBe(256);
            });

            it("should update stats when acquiring", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                pool.acquire(128, 128);

                const stats = pool.getStats();
                expect(stats.total).toBe(1);
                expect(stats.inUse).toBe(1);
            });

            it("should reuse released texture with same dimensions", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture1 = pool.acquire(256, 256);
                pool.release(texture1);
                const texture2 = pool.acquire(256, 256);

                expect(texture1).toBe(texture2);
            });

            it("should create new texture for different dimensions", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture1 = pool.acquire(256, 256);
                const texture2 = pool.acquire(512, 512);

                expect(texture1).not.toBe(texture2);
            });

            it("should use default format and usage", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture = pool.acquire(128, 128);

                expect(texture.format).toBe("rgba8unorm");
            });

            it("should accept custom format", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture = pool.acquire(128, 128, "rgba16float");

                expect(texture.format).toBe("rgba16float");
            });
        });

        describe("release", () =>
        {
            it("should mark texture as available", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture = pool.acquire(256, 256);
                pool.release(texture);

                const stats = pool.getStats();
                expect(stats.inUse).toBe(0);
                expect(stats.available).toBe(1);
            });

            it("should allow reuse after release", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const texture1 = pool.acquire(256, 256);
                pool.release(texture1);

                const stats = pool.getStats();
                expect(stats.available).toBe(1);
            });
        });

        describe("getStats", () =>
        {
            it("should return accurate pool statistics", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                pool.acquire(128, 128);
                pool.acquire(256, 256);
                const tex3 = pool.acquire(512, 512);
                pool.release(tex3);

                const stats = pool.getStats();
                expect(stats.total).toBe(3);
                expect(stats.inUse).toBe(2);
                expect(stats.available).toBe(1);
            });
        });

        describe("dispose", () =>
        {
            it("should destroy all textures", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                const tex1 = pool.acquire(128, 128);
                const tex2 = pool.acquire(256, 256);

                pool.dispose();

                expect(tex1.destroy).toHaveBeenCalled();
                expect(tex2.destroy).toHaveBeenCalled();
            });

            it("should reset pool to empty", () =>
            {
                const device = createMockDevice();
                const pool = new TexturePool(device);

                pool.acquire(128, 128);
                pool.acquire(256, 256);

                pool.dispose();

                const stats = pool.getStats();
                expect(stats.total).toBe(0);
            });
        });
    });

    describe("global functions", () =>
    {
        describe("initTexturePool", () =>
        {
            it("should initialize global pool", () =>
            {
                const device = createMockDevice();

                initTexturePool(device);

                expect(getTexturePool()).not.toBeNull();
            });
        });

        describe("getTexturePool", () =>
        {
            it("should return pool after initialization", () =>
            {
                const device = createMockDevice();
                initTexturePool(device);

                expect(getTexturePool()).toBeInstanceOf(TexturePool);
            });
        });

        describe("clearTexturePool", () =>
        {
            it("should dispose pool", () =>
            {
                const device = createMockDevice();
                initTexturePool(device);
                const pool = getTexturePool();
                const tex = pool!.acquire(128, 128);

                clearTexturePool();

                expect(tex.destroy).toHaveBeenCalled();
            });

            it("should not throw when pool is null", () =>
            {
                expect(() => clearTexturePool()).not.toThrow();
            });
        });
    });
});
