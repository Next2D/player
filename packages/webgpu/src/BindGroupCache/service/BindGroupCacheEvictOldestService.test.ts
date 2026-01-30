import { describe, it, expect, beforeEach } from "vitest";
import type { ICachedBindGroup } from "../interface/ICachedBindGroup";
import { execute } from "./BindGroupCacheEvictOldestService";

describe("BindGroupCacheEvictOldestService", () =>
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

    it("should evict the oldest entry", () =>
    {
        cache.set("old", createMockEntry(10));
        cache.set("middle", createMockEntry(50));
        cache.set("recent", createMockEntry(100));

        execute(cache);

        expect(cache.has("old")).toBe(false);
        expect(cache.has("middle")).toBe(true);
        expect(cache.has("recent")).toBe(true);
        expect(cache.size).toBe(2);
    });

    it("should handle empty cache", () =>
    {
        expect(() => execute(cache)).not.toThrow();
        expect(cache.size).toBe(0);
    });

    it("should handle single entry", () =>
    {
        cache.set("only", createMockEntry(50));

        execute(cache);

        expect(cache.size).toBe(0);
    });

    it("should evict first oldest when multiple have same frame", () =>
    {
        cache.set("first", createMockEntry(10));
        cache.set("second", createMockEntry(10));
        cache.set("third", createMockEntry(10));

        execute(cache);

        expect(cache.size).toBe(2);
        // One of them should be removed (first one found)
    });

    it("should only remove one entry per call", () =>
    {
        cache.set("a", createMockEntry(10));
        cache.set("b", createMockEntry(20));
        cache.set("c", createMockEntry(30));

        execute(cache);
        expect(cache.size).toBe(2);

        execute(cache);
        expect(cache.size).toBe(1);

        execute(cache);
        expect(cache.size).toBe(0);
    });

    it("should correctly identify oldest among scattered values", () =>
    {
        cache.set("z", createMockEntry(100));
        cache.set("a", createMockEntry(5));   // oldest
        cache.set("m", createMockEntry(50));

        execute(cache);

        expect(cache.has("a")).toBe(false);
        expect(cache.has("z")).toBe(true);
        expect(cache.has("m")).toBe(true);
    });
});
