import { describe, it, expect, beforeEach, vi } from "vitest";
import type { IPooledBuffer } from "../../interface/IPooledBuffer";
import { execute } from "./BufferManagerReleaseUniformBufferService";

describe("BufferManagerReleaseUniformBufferService", () =>
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
        const buffer = createMockBuffer(256);

        execute(pool, buffer);

        expect(pool.length).toBe(1);
        expect(pool[0].buffer).toBe(buffer);
        expect(pool[0].size).toBe(256);
    });

    it("should add multiple uniform buffers", () =>
    {
        const buffer1 = createMockBuffer(256);
        const buffer2 = createMockBuffer(512);

        execute(pool, buffer1);
        execute(pool, buffer2);

        expect(pool.length).toBe(2);
    });

    it("should evict smallest buffer when pool is full", () =>
    {
        // Fill pool to max (32)
        for (let i = 0; i < 32; i++) {
            pool.push(createPoolEntry((i + 1) * 64)); // sizes: 64, 128, ..., 2048
        }

        const smallestBuffer = pool[0].buffer; // size 64
        const newBuffer = createMockBuffer(4096);

        execute(pool, newBuffer);

        expect(pool.length).toBe(32);
        expect(smallestBuffer.destroy).toHaveBeenCalled();
        expect(pool.some((e) => e.buffer === newBuffer)).toBe(true);
    });

    it("should correctly identify smallest buffer", () =>
    {
        pool.push(createPoolEntry(1024));
        pool.push(createPoolEntry(128)); // smallest
        pool.push(createPoolEntry(512));
        pool.push(createPoolEntry(256));

        // Fill remaining slots
        for (let i = 4; i < 32; i++) {
            pool.push(createPoolEntry(2048));
        }

        const smallestBuffer = pool[1].buffer; // size 128
        const newBuffer = createMockBuffer(3000);

        execute(pool, newBuffer);

        expect(smallestBuffer.destroy).toHaveBeenCalled();
    });

    it("should not evict when pool has space", () =>
    {
        const existing = createPoolEntry(256);
        pool.push(existing);

        const newBuffer = createMockBuffer(512);
        execute(pool, newBuffer);

        expect(existing.buffer.destroy).not.toHaveBeenCalled();
        expect(pool.length).toBe(2);
    });

    it("should handle empty pool", () =>
    {
        const buffer = createMockBuffer(256);

        expect(() => execute(pool, buffer)).not.toThrow();
        expect(pool.length).toBe(1);
    });

    it("should store correct size from buffer property", () =>
    {
        const buffer = createMockBuffer(1024);

        execute(pool, buffer);

        expect(pool[0].size).toBe(buffer.size);
    });
});
