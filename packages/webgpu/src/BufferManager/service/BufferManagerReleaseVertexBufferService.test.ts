import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledBuffer } from "../../interface/IPooledBuffer";
import { execute } from "./BufferManagerReleaseVertexBufferService";

describe("BufferManagerReleaseVertexBufferService", () =>
{
    let pool: IPooledBuffer[];

    const createMockBuffer = (size: number): GPUBuffer => ({
        "size": size,
        "destroy": vi.fn()
    } as unknown as GPUBuffer);

    const createPoolEntry = (size: number): IPooledBuffer => ({
        "buffer": createMockBuffer(size),
        size
    });

    beforeEach(() =>
    {
        pool = [];
    });

    it("should add buffer to pool", () =>
    {
        const buffer = createMockBuffer(1024);

        execute(pool, buffer);

        expect(pool.length).toBe(1);
        expect(pool[0].buffer).toBe(buffer);
        expect(pool[0].size).toBe(1024);
    });

    it("should add multiple buffers", () =>
    {
        const buffer1 = createMockBuffer(512);
        const buffer2 = createMockBuffer(1024);

        execute(pool, buffer1);
        execute(pool, buffer2);

        expect(pool.length).toBe(2);
    });

    it("should evict smallest buffer when pool is full", () =>
    {
        // Fill pool to max (32)
        for (let i = 0; i < 32; i++) {
            pool.push(createPoolEntry((i + 1) * 100)); // sizes: 100, 200, ..., 3200
        }

        const smallestBuffer = pool[0].buffer; // size 100
        const newBuffer = createMockBuffer(5000);

        execute(pool, newBuffer);

        expect(pool.length).toBe(32);
        expect(smallestBuffer.destroy).toHaveBeenCalled();
        expect(pool.some((e) => e.buffer === newBuffer)).toBe(true);
    });

    it("should find and evict smallest among all entries", () =>
    {
        // Create pool with sizes: 500, 100, 300, 200, 400
        pool.push(createPoolEntry(500));
        pool.push(createPoolEntry(100)); // smallest
        pool.push(createPoolEntry(300));
        pool.push(createPoolEntry(200));
        pool.push(createPoolEntry(400));

        // Fill to 32
        for (let i = 5; i < 32; i++) {
            pool.push(createPoolEntry(1000 + i));
        }

        const smallestBuffer = pool[1].buffer; // size 100
        const newBuffer = createMockBuffer(2000);

        execute(pool, newBuffer);

        expect(smallestBuffer.destroy).toHaveBeenCalled();
        expect(pool.some((e) => e.size === 100)).toBe(false);
    });

    it("should not evict when pool has space", () =>
    {
        const existing = createPoolEntry(1024);
        pool.push(existing);

        const newBuffer = createMockBuffer(2048);
        execute(pool, newBuffer);

        expect(existing.buffer.destroy).not.toHaveBeenCalled();
        expect(pool.length).toBe(2);
    });

    it("should handle pool exactly at max size", () =>
    {
        for (let i = 0; i < 32; i++) {
            pool.push(createPoolEntry(1024));
        }

        const newBuffer = createMockBuffer(2048);
        execute(pool, newBuffer);

        expect(pool.length).toBe(32);
    });
});
