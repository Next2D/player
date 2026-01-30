import { describe, it, expect, vi } from "vitest";
import { execute } from "./SamplerCacheGetOrCreateService";

describe("SamplerCacheGetOrCreateService", () =>
{
    const createMockDevice = () =>
    {
        return {
            "createSampler": vi.fn((descriptor) => ({ ...descriptor, "label": "mock-sampler" }))
        } as unknown as GPUDevice;
    };

    it("should return cached sampler if exists", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();
        const existingSampler = { "label": "existing" } as unknown as GPUSampler;

        // Pre-populate cache with correct key format (underscore separated)
        cache.set("linear_linear_clamp-to-edge_clamp-to-edge", existingSampler);

        const result = execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");

        expect(result).toBe(existingSampler);
        expect(device.createSampler).not.toHaveBeenCalled();
    });

    it("should create new sampler if not cached", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");

        expect(device.createSampler).toHaveBeenCalledWith({
            "minFilter": "linear",
            "magFilter": "linear",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });
    });

    it("should cache newly created sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        const result = execute(device, cache, "nearest", "nearest", "repeat", "repeat");

        expect(cache.has("nearest_nearest_repeat_repeat")).toBe(true);
        expect(cache.get("nearest_nearest_repeat_repeat")).toBe(result);
    });

    it("should generate correct cache key", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache, "linear", "nearest", "repeat", "mirror-repeat");

        expect(cache.has("linear_nearest_repeat_mirror-repeat")).toBe(true);
    });

    it("should return same sampler for same parameters", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        const result1 = execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");
        const result2 = execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");

        expect(result1).toBe(result2);
        expect(device.createSampler).toHaveBeenCalledTimes(1);
    });

    it("should create different samplers for different parameters", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        const result1 = execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");
        const result2 = execute(device, cache, "nearest", "nearest", "repeat", "repeat");

        expect(result1).not.toBe(result2);
        expect(device.createSampler).toHaveBeenCalledTimes(2);
    });

    it("should handle all filter modes", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");
        execute(device, cache, "nearest", "nearest", "clamp-to-edge", "clamp-to-edge");

        expect(cache.size).toBe(2);
    });

    it("should handle all address modes", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache, "linear", "linear", "clamp-to-edge", "clamp-to-edge");
        execute(device, cache, "linear", "linear", "repeat", "repeat");
        execute(device, cache, "linear", "linear", "mirror-repeat", "mirror-repeat");

        expect(cache.size).toBe(3);
    });
});
