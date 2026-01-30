import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledTexture } from "../interface/IPooledTexture";
import { execute } from "./TexturePoolReleaseService";

describe("TexturePoolReleaseService", () =>
{
    let pool: IPooledTexture[];

    const createMockEntry = (
        texture: GPUTexture,
        inUse: boolean = true,
        lastUsedFrame: number = 0
    ): IPooledTexture => ({
        texture,
        "width": 256,
        "height": 256,
        "format": "rgba8unorm" as GPUTextureFormat,
        inUse,
        lastUsedFrame
    });

    beforeEach(() =>
    {
        pool = [];
    });

    it("should release texture back to pool", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry = createMockEntry(mockTexture, true, 0);
        pool.push(entry);

        execute(pool, mockTexture, 100);

        expect(entry.inUse).toBe(false);
        expect(entry.lastUsedFrame).toBe(100);
    });

    it("should update lastUsedFrame on release", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry = createMockEntry(mockTexture, true, 50);
        pool.push(entry);

        execute(pool, mockTexture, 200);

        expect(entry.lastUsedFrame).toBe(200);
    });

    it("should only release matching texture", () =>
    {
        const texture1 = { "id": 1 } as unknown as GPUTexture;
        const texture2 = { "id": 2 } as unknown as GPUTexture;
        const entry1 = createMockEntry(texture1, true, 0);
        const entry2 = createMockEntry(texture2, true, 0);
        pool.push(entry1, entry2);

        execute(pool, texture1, 100);

        expect(entry1.inUse).toBe(false);
        expect(entry2.inUse).toBe(true);
    });

    it("should handle texture not in pool", () =>
    {
        const unknownTexture = { "id": 999 } as unknown as GPUTexture;

        expect(() => execute(pool, unknownTexture, 100)).not.toThrow();
    });

    it("should handle empty pool", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;

        expect(() => execute(pool, mockTexture, 100)).not.toThrow();
    });

    it("should find texture in middle of pool", () =>
    {
        const texture1 = { "id": 1 } as unknown as GPUTexture;
        const texture2 = { "id": 2 } as unknown as GPUTexture;
        const texture3 = { "id": 3 } as unknown as GPUTexture;

        const entry1 = createMockEntry(texture1, true, 0);
        const entry2 = createMockEntry(texture2, true, 0);
        const entry3 = createMockEntry(texture3, true, 0);
        pool.push(entry1, entry2, entry3);

        execute(pool, texture2, 100);

        expect(entry1.inUse).toBe(true);
        expect(entry2.inUse).toBe(false);
        expect(entry3.inUse).toBe(true);
    });

    it("should stop after finding first match", () =>
    {
        const mockTexture = { "id": 1 } as unknown as GPUTexture;
        const entry1 = createMockEntry(mockTexture, true, 0);
        const entry2 = createMockEntry(mockTexture, true, 0); // Same texture reference
        pool.push(entry1, entry2);

        execute(pool, mockTexture, 100);

        // Only first matching entry should be released
        expect(entry1.inUse).toBe(false);
    });
});
