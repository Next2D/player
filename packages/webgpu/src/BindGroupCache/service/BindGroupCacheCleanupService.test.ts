import { describe, it, expect, beforeEach } from "vitest";
import type { ICachedBindGroup } from "../../interface/ICachedBindGroup";
import { execute } from "./BindGroupCacheCleanupService";

describe("BindGroupCacheCleanupService", () =>
{
    let cache: Map<string, ICachedBindGroup>;

    const createMockEntry = (lastUsedFrame: number): ICachedBindGroup => ({
        "bindGroup": {} as GPUBindGroup,
        lastUsedFrame
    });

    beforeEach(() =>
    {
        cache = new Map();
    });

    it("should remove entries older than threshold", () =>
    {
        cache.set("old1", createMockEntry(10));
        cache.set("old2", createMockEntry(20));
        cache.set("recent", createMockEntry(90));

        execute(cache, 100, 50); // threshold = 50, so remove entries before frame 50

        expect(cache.has("old1")).toBe(false);
        expect(cache.has("old2")).toBe(false);
        expect(cache.has("recent")).toBe(true);
    });

    it("should keep entries at exactly threshold boundary", () =>
    {
        cache.set("boundary", createMockEntry(50));
        cache.set("justAfter", createMockEntry(51));

        execute(cache, 100, 50); // threshold = 50, frameThreshold = 50

        // 50 < 50 is false, so boundary is KEPT
        // 51 < 50 is false, so justAfter is KEPT
        expect(cache.has("boundary")).toBe(true);
        expect(cache.has("justAfter")).toBe(true);
    });

    it("should handle empty cache", () =>
    {
        expect(() => execute(cache, 100, 50)).not.toThrow();
        expect(cache.size).toBe(0);
    });

    it("should remove all entries if all are old", () =>
    {
        cache.set("old1", createMockEntry(0));
        cache.set("old2", createMockEntry(10));
        cache.set("old3", createMockEntry(20));

        execute(cache, 100, 30);

        expect(cache.size).toBe(0);
    });

    it("should keep all entries if none are old", () =>
    {
        cache.set("recent1", createMockEntry(80));
        cache.set("recent2", createMockEntry(90));
        cache.set("recent3", createMockEntry(100));

        execute(cache, 100, 50);

        expect(cache.size).toBe(3);
    });

    it("should work with threshold of 0", () =>
    {
        cache.set("entry1", createMockEntry(99));
        cache.set("entry2", createMockEntry(100));

        execute(cache, 100, 0); // frameThreshold = 100 - 0 = 100

        // 99 < 100 is true, so entry1 is DELETED
        // 100 < 100 is false, so entry2 is KEPT
        expect(cache.has("entry1")).toBe(false);
        expect(cache.has("entry2")).toBe(true);
    });

    it("should handle large frame numbers", () =>
    {
        cache.set("old", createMockEntry(999900));
        cache.set("recent", createMockEntry(999990));

        execute(cache, 1000000, 50);

        expect(cache.has("old")).toBe(false);
        expect(cache.has("recent")).toBe(true);
    });
});
