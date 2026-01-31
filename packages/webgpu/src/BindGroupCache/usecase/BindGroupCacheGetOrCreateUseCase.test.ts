import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ICachedBindGroup } from "../../interface/ICachedBindGroup";
import { execute } from "./BindGroupCacheGetOrCreateUseCase";

// Mock the eviction service
vi.mock("../service/BindGroupCacheEvictOldestService", () => ({
    "execute": vi.fn()
}));

import { execute as mockEvictOldest } from "../service/BindGroupCacheEvictOldestService";

describe("BindGroupCacheGetOrCreateUseCase", () =>
{
    let cache: Map<string, ICachedBindGroup>;

    const createMockDevice = () =>
    {
        const mockBindGroup = { "label": "mockBindGroup" };
        return {
            "createBindGroup": vi.fn(() => mockBindGroup),
            "_mockBindGroup": mockBindGroup
        } as unknown as GPUDevice & { _mockBindGroup: any };
    };

    const createMockLayout = () =>
    {
        return { "label": "mockLayout" } as unknown as GPUBindGroupLayout;
    };

    const createMockEntries = (): GPUBindGroupEntry[] =>
    {
        return [
            { "binding": 0, "resource": {} as GPUSampler }
        ];
    };

    beforeEach(() =>
    {
        cache = new Map();
        vi.clearAllMocks();
    });

    describe("cache hit", () =>
    {
        it("should return cached bind group when key exists", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();
            const existingBindGroup = { "label": "existingBindGroup" } as unknown as GPUBindGroup;

            cache.set("testKey", {
                "bindGroup": existingBindGroup,
                "lastUsedFrame": 10
            });

            const result = execute(device, cache, "testKey", layout, entries, 20, 100);

            expect(result).toBe(existingBindGroup);
            expect(device.createBindGroup).not.toHaveBeenCalled();
        });

        it("should update lastUsedFrame on cache hit", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();
            const existingBindGroup = { "label": "existingBindGroup" } as unknown as GPUBindGroup;

            cache.set("testKey", {
                "bindGroup": existingBindGroup,
                "lastUsedFrame": 10
            });

            execute(device, cache, "testKey", layout, entries, 50, 100);

            expect(cache.get("testKey")?.lastUsedFrame).toBe(50);
        });
    });

    describe("cache miss", () =>
    {
        it("should create new bind group when key not in cache", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            execute(device, cache, "newKey", layout, entries, 20, 100);

            expect(device.createBindGroup).toHaveBeenCalledWith({
                "layout": layout,
                "entries": entries
            });
        });

        it("should return newly created bind group", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            const result = execute(device, cache, "newKey", layout, entries, 20, 100);

            expect(result).toBe((device as any)._mockBindGroup);
        });

        it("should add new entry to cache", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            execute(device, cache, "newKey", layout, entries, 25, 100);

            expect(cache.has("newKey")).toBe(true);
            expect(cache.get("newKey")?.lastUsedFrame).toBe(25);
        });
    });

    describe("cache eviction", () =>
    {
        it("should evict oldest when cache is full", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            // Fill cache to max
            for (let i = 0; i < 10; i++) {
                cache.set(`key${i}`, {
                    "bindGroup": {} as GPUBindGroup,
                    "lastUsedFrame": i
                });
            }

            execute(device, cache, "newKey", layout, entries, 20, 10);

            expect(mockEvictOldest).toHaveBeenCalledWith(cache);
        });

        it("should not evict when cache is not full", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            // Add some entries but not full
            for (let i = 0; i < 5; i++) {
                cache.set(`key${i}`, {
                    "bindGroup": {} as GPUBindGroup,
                    "lastUsedFrame": i
                });
            }

            execute(device, cache, "newKey", layout, entries, 20, 10);

            expect(mockEvictOldest).not.toHaveBeenCalled();
        });

        it("should not evict on cache hit", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            // Fill cache completely
            for (let i = 0; i < 10; i++) {
                cache.set(`key${i}`, {
                    "bindGroup": {} as GPUBindGroup,
                    "lastUsedFrame": i
                });
            }

            // Access existing key
            execute(device, cache, "key5", layout, entries, 20, 10);

            expect(mockEvictOldest).not.toHaveBeenCalled();
        });
    });

    describe("edge cases", () =>
    {
        it("should handle empty cache", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            const result = execute(device, cache, "firstKey", layout, entries, 1, 100);

            expect(result).toBe((device as any)._mockBindGroup);
            expect(cache.size).toBe(1);
        });

        it("should handle maxCacheEntries of 1", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            cache.set("existingKey", {
                "bindGroup": {} as GPUBindGroup,
                "lastUsedFrame": 1
            });

            execute(device, cache, "newKey", layout, entries, 20, 1);

            expect(mockEvictOldest).toHaveBeenCalled();
        });

        it("should handle frame 0", () =>
        {
            const device = createMockDevice();
            const layout = createMockLayout();
            const entries = createMockEntries();

            execute(device, cache, "key", layout, entries, 0, 100);

            expect(cache.get("key")?.lastUsedFrame).toBe(0);
        });
    });
});
