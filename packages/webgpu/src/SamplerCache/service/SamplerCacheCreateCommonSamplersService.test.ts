import { describe, it, expect, vi } from "vitest";
import { execute } from "./SamplerCacheCreateCommonSamplersService";

describe("SamplerCacheCreateCommonSamplersService", () =>
{
    const createMockDevice = () =>
    {
        let samplerId = 0;
        return {
            "createSampler": vi.fn(() => ({ "id": ++samplerId }))
        } as unknown as GPUDevice;
    };

    it("should create 5 common samplers", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.size).toBe(5);
    });

    it("should create linear clamp sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.has("linear_linear_clamp-to-edge_clamp-to-edge")).toBe(true);
    });

    it("should create nearest clamp sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.has("nearest_nearest_clamp-to-edge_clamp-to-edge")).toBe(true);
    });

    it("should create linear repeat sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.has("linear_linear_repeat_repeat")).toBe(true);
    });

    it("should create nearest repeat sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.has("nearest_nearest_repeat_repeat")).toBe(true);
    });

    it("should create linear mirror repeat sampler", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(cache.has("linear_linear_mirror-repeat_mirror-repeat")).toBe(true);
    });

    it("should not overwrite existing samplers", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();
        const existingSampler = { "id": "existing" } as unknown as GPUSampler;
        cache.set("linear_linear_clamp-to-edge_clamp-to-edge", existingSampler);

        execute(device, cache);

        expect(cache.get("linear_linear_clamp-to-edge_clamp-to-edge")).toBe(existingSampler);
    });

    it("should call createSampler with correct parameters", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        // Verify first call (linear clamp)
        expect(device.createSampler).toHaveBeenCalledWith({
            "minFilter": "linear",
            "magFilter": "linear",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });

        // Verify nearest clamp was called
        expect(device.createSampler).toHaveBeenCalledWith({
            "minFilter": "nearest",
            "magFilter": "nearest",
            "addressModeU": "clamp-to-edge",
            "addressModeV": "clamp-to-edge"
        });
    });

    it("should only call createSampler 5 times for empty cache", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);

        expect(device.createSampler).toHaveBeenCalledTimes(5);
    });

    it("should be idempotent when called multiple times", () =>
    {
        const device = createMockDevice();
        const cache = new Map<string, GPUSampler>();

        execute(device, cache);
        const sizeAfterFirst = cache.size;
        const callsAfterFirst = (device.createSampler as any).mock.calls.length;

        execute(device, cache);

        expect(cache.size).toBe(sizeAfterFirst);
        expect(device.createSampler).toHaveBeenCalledTimes(callsAfterFirst);
    });
});
