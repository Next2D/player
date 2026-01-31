import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    BindGroupCache,
    initBindGroupCache,
    getBindGroupCache,
    clearBindGroupCache
} from "./BindGroupCache";

// Mock the usecase and service modules
vi.mock("./BindGroupCache/usecase/BindGroupCacheGetOrCreateUseCase", () => ({
    "execute": vi.fn((device, cache, key, layout, entries, currentFrame, maxEntries) => {
        if (!cache.has(key)) {
            const bindGroup = { "label": key } as unknown as GPUBindGroup;
            cache.set(key, { "bindGroup": bindGroup, "lastUsedFrame": currentFrame });
        } else {
            cache.get(key).lastUsedFrame = currentFrame;
        }
        return cache.get(key).bindGroup;
    })
}));

vi.mock("./BindGroupCache/service/BindGroupCacheCleanupService", () => ({
    "execute": vi.fn((cache, currentFrame, threshold) => {
        for (const [key, value] of cache.entries()) {
            if (currentFrame - value.lastUsedFrame > threshold) {
                cache.delete(key);
            }
        }
    })
}));

describe("BindGroupCache", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
        } as unknown as GPUDevice;
    };

    const createMockLayout = (): GPUBindGroupLayout =>
    {
        return { "label": "mockLayout" } as unknown as GPUBindGroupLayout;
    };

    const createMockSampler = (): GPUSampler =>
    {
        return { "label": "mockSampler" } as unknown as GPUSampler;
    };

    const createMockTextureView = (): GPUTextureView =>
    {
        return { "label": "mockTextureView" } as unknown as GPUTextureView;
    };

    const createMockBuffer = (): GPUBuffer =>
    {
        return { "label": "mockBuffer" } as unknown as GPUBuffer;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        clearBindGroupCache();
    });

    describe("BindGroupCache class", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const cache = new BindGroupCache(device);

            expect(cache).toBeDefined();
        });

        it("should start with empty cache", () =>
        {
            const device = createMockDevice();
            const cache = new BindGroupCache(device);

            const stats = cache.getStats();
            expect(stats.size).toBe(0);
            expect(stats.currentFrame).toBe(0);
        });

        describe("beginFrame", () =>
        {
            it("should increment frame counter", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);

                cache.beginFrame();

                expect(cache.getStats().currentFrame).toBe(1);
            });

            it("should increment frame counter on each call", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);

                cache.beginFrame();
                cache.beginFrame();
                cache.beginFrame();

                expect(cache.getStats().currentFrame).toBe(3);
            });

            it("should trigger cleanup every 60 frames", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                // Add an entry
                cache.getOrCreate("test", layout, []);

                // Run for 60 frames
                for (let i = 0; i < 60; i++) {
                    cache.beginFrame();
                }

                // Cleanup should have been triggered
                // Entry should still exist if within threshold
                expect(cache.getStats().size).toBe(1);
            });
        });

        describe("getOrCreate", () =>
        {
            it("should create new bind group for new key", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                const bindGroup = cache.getOrCreate("test-key", layout, []);

                expect(bindGroup).toBeDefined();
                expect(cache.getStats().size).toBe(1);
            });

            it("should return cached bind group for same key", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                const bindGroup1 = cache.getOrCreate("test-key", layout, []);
                const bindGroup2 = cache.getOrCreate("test-key", layout, []);

                expect(bindGroup1).toBe(bindGroup2);
                expect(cache.getStats().size).toBe(1);
            });

            it("should create different bind groups for different keys", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                const bindGroup1 = cache.getOrCreate("key-1", layout, []);
                const bindGroup2 = cache.getOrCreate("key-2", layout, []);

                expect(bindGroup1).not.toBe(bindGroup2);
                expect(cache.getStats().size).toBe(2);
            });
        });

        describe("getOrCreateSamplerTexture", () =>
        {
            it("should create bind group with sampler and texture", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();
                const sampler = createMockSampler();
                const textureView = createMockTextureView();

                const bindGroup = cache.getOrCreateSamplerTexture(
                    "sampler-texture-key",
                    layout,
                    sampler,
                    textureView
                );

                expect(bindGroup).toBeDefined();
            });

            it("should return cached bind group on subsequent calls", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();
                const sampler = createMockSampler();
                const textureView = createMockTextureView();

                const bindGroup1 = cache.getOrCreateSamplerTexture(
                    "sampler-texture-key",
                    layout,
                    sampler,
                    textureView
                );
                const bindGroup2 = cache.getOrCreateSamplerTexture(
                    "sampler-texture-key",
                    layout,
                    sampler,
                    textureView
                );

                expect(bindGroup1).toBe(bindGroup2);
            });
        });

        describe("getOrCreateUniformSamplerTexture", () =>
        {
            it("should create bind group with uniform, sampler and texture", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();
                const uniformBuffer = createMockBuffer();
                const sampler = createMockSampler();
                const textureView = createMockTextureView();

                const bindGroup = cache.getOrCreateUniformSamplerTexture(
                    "uniform-sampler-texture-key",
                    layout,
                    uniformBuffer,
                    sampler,
                    textureView
                );

                expect(bindGroup).toBeDefined();
            });

            it("should return cached bind group on subsequent calls", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();
                const uniformBuffer = createMockBuffer();
                const sampler = createMockSampler();
                const textureView = createMockTextureView();

                const bindGroup1 = cache.getOrCreateUniformSamplerTexture(
                    "uniform-sampler-texture-key",
                    layout,
                    uniformBuffer,
                    sampler,
                    textureView
                );
                const bindGroup2 = cache.getOrCreateUniformSamplerTexture(
                    "uniform-sampler-texture-key",
                    layout,
                    uniformBuffer,
                    sampler,
                    textureView
                );

                expect(bindGroup1).toBe(bindGroup2);
            });
        });

        describe("clear", () =>
        {
            it("should clear all cached entries", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                cache.getOrCreate("key-1", layout, []);
                cache.getOrCreate("key-2", layout, []);
                cache.getOrCreate("key-3", layout, []);

                cache.clear();

                expect(cache.getStats().size).toBe(0);
            });
        });

        describe("getStats", () =>
        {
            it("should return size and currentFrame", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                cache.beginFrame();
                cache.getOrCreate("test", layout, []);

                const stats = cache.getStats();

                expect(stats.size).toBe(1);
                expect(stats.currentFrame).toBe(1);
            });
        });

        describe("dispose", () =>
        {
            it("should clear cache", () =>
            {
                const device = createMockDevice();
                const cache = new BindGroupCache(device);
                const layout = createMockLayout();

                cache.getOrCreate("test", layout, []);

                cache.dispose();

                expect(cache.getStats().size).toBe(0);
            });
        });
    });

    describe("global functions", () =>
    {
        describe("initBindGroupCache", () =>
        {
            it("should initialize global cache", () =>
            {
                const device = createMockDevice();

                initBindGroupCache(device);

                expect(getBindGroupCache()).not.toBeNull();
            });
        });

        describe("getBindGroupCache", () =>
        {
            it("should return cache after initialization", () =>
            {
                const device = createMockDevice();
                initBindGroupCache(device);

                expect(getBindGroupCache()).toBeInstanceOf(BindGroupCache);
            });
        });

        describe("clearBindGroupCache", () =>
        {
            it("should clear cache entries", () =>
            {
                const device = createMockDevice();
                initBindGroupCache(device);
                const cache = getBindGroupCache();
                const layout = createMockLayout();

                cache!.getOrCreate("test", layout, []);
                clearBindGroupCache();

                expect(cache!.getStats().size).toBe(0);
            });

            it("should not throw when cache is null", () =>
            {
                expect(() => clearBindGroupCache()).not.toThrow();
            });
        });
    });
});
