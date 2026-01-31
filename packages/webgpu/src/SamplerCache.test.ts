import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    SamplerCache,
    initSamplerCache,
    getSamplerCache,
    clearSamplerCache
} from "./SamplerCache";

// Mock the service modules
vi.mock("./SamplerCache/service/SamplerCacheGetOrCreateService", () => ({
    "execute": vi.fn((device, cache, minFilter, magFilter, addressModeU, addressModeV) => {
        const key = `${minFilter}_${magFilter}_${addressModeU}_${addressModeV}`;
        if (!cache.has(key)) {
            const sampler = { "label": key } as unknown as GPUSampler;
            cache.set(key, sampler);
        }
        return cache.get(key);
    })
}));

vi.mock("./SamplerCache/service/SamplerCacheCreateCommonSamplersService", () => ({
    "execute": vi.fn((device, cache) => {
        // Pre-create common samplers
        cache.set("linear_linear_clamp-to-edge_clamp-to-edge", { "label": "linearClamp" });
        cache.set("nearest_nearest_clamp-to-edge_clamp-to-edge", { "label": "nearestClamp" });
        cache.set("linear_linear_repeat_repeat", { "label": "linearRepeat" });
        cache.set("nearest_nearest_repeat_repeat", { "label": "nearestRepeat" });
    })
}));

describe("SamplerCache", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        clearSamplerCache();
    });

    describe("SamplerCache class", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const cache = new SamplerCache(device);

            expect(cache).toBeDefined();
        });

        it("should pre-create common samplers on initialization", () =>
        {
            const device = createMockDevice();
            const cache = new SamplerCache(device);

            const stats = cache.getStats();
            expect(stats.size).toBe(4);
        });

        describe("getOrCreate", () =>
        {
            it("should get existing sampler from cache", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler1 = cache.getOrCreate("linear", "linear", "clamp-to-edge", "clamp-to-edge");
                const sampler2 = cache.getOrCreate("linear", "linear", "clamp-to-edge", "clamp-to-edge");

                expect(sampler1).toBe(sampler2);
            });

            it("should create new sampler for new combination", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const initialSize = cache.getStats().size;

                cache.getOrCreate("linear", "nearest", "mirror-repeat", "clamp-to-edge");

                expect(cache.getStats().size).toBe(initialSize + 1);
            });
        });

        describe("getLinearClamp", () =>
        {
            it("should return linear clamp sampler", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getLinearClamp();

                expect(sampler).toBeDefined();
            });

            it("should return same instance on multiple calls", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler1 = cache.getLinearClamp();
                const sampler2 = cache.getLinearClamp();

                expect(sampler1).toBe(sampler2);
            });
        });

        describe("getNearestClamp", () =>
        {
            it("should return nearest clamp sampler", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getNearestClamp();

                expect(sampler).toBeDefined();
            });
        });

        describe("getLinearRepeat", () =>
        {
            it("should return linear repeat sampler", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getLinearRepeat();

                expect(sampler).toBeDefined();
            });
        });

        describe("getNearestRepeat", () =>
        {
            it("should return nearest repeat sampler", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getNearestRepeat();

                expect(sampler).toBeDefined();
            });
        });

        describe("getBySmoothRepeat", () =>
        {
            it("should return linear clamp for smooth=true, repeat=false", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getBySmoothRepeat(true, false);
                const linearClamp = cache.getLinearClamp();

                expect(sampler).toBe(linearClamp);
            });

            it("should return nearest clamp for smooth=false, repeat=false", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getBySmoothRepeat(false, false);
                const nearestClamp = cache.getNearestClamp();

                expect(sampler).toBe(nearestClamp);
            });

            it("should return linear repeat for smooth=true, repeat=true", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getBySmoothRepeat(true, true);
                const linearRepeat = cache.getLinearRepeat();

                expect(sampler).toBe(linearRepeat);
            });

            it("should return nearest repeat for smooth=false, repeat=true", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const sampler = cache.getBySmoothRepeat(false, true);
                const nearestRepeat = cache.getNearestRepeat();

                expect(sampler).toBe(nearestRepeat);
            });
        });

        describe("getStats", () =>
        {
            it("should return cache size", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                const stats = cache.getStats();

                expect(stats).toHaveProperty("size");
                expect(typeof stats.size).toBe("number");
            });
        });

        describe("dispose", () =>
        {
            it("should clear cache", () =>
            {
                const device = createMockDevice();
                const cache = new SamplerCache(device);

                cache.dispose();

                expect(cache.getStats().size).toBe(0);
            });
        });
    });

    describe("global functions", () =>
    {
        describe("initSamplerCache", () =>
        {
            it("should initialize global cache", () =>
            {
                const device = createMockDevice();

                initSamplerCache(device);

                expect(getSamplerCache()).not.toBeNull();
            });
        });

        describe("getSamplerCache", () =>
        {
            it("should return cache after initialization", () =>
            {
                const device = createMockDevice();
                initSamplerCache(device);

                expect(getSamplerCache()).toBeInstanceOf(SamplerCache);
            });
        });

        describe("clearSamplerCache", () =>
        {
            it("should dispose cache", () =>
            {
                const device = createMockDevice();
                initSamplerCache(device);
                const cache = getSamplerCache();

                clearSamplerCache();

                expect(cache!.getStats().size).toBe(0);
            });

            it("should not throw when cache is null", () =>
            {
                expect(() => clearSamplerCache()).not.toThrow();
            });
        });
    });
});
