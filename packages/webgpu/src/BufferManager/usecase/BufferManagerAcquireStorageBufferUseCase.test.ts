import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPooledStorageBuffer } from "../../interface/IStorageBufferConfig";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    VERTEX: 0x0020,
    INDEX: 0x0010,
    UNIFORM: 0x0040,
    STORAGE: 0x0080,
    INDIRECT: 0x0100,
    COPY_SRC: 0x0004,
    COPY_DST: 0x0008
};

// Set global
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock the service
vi.mock("../service/BufferManagerCreateStorageBufferService", () => ({
    execute: vi.fn((device, config) => ({
        "size": config.size,
        "destroy": vi.fn()
    }))
}));

import { execute } from "./BufferManagerAcquireStorageBufferUseCase";
import { execute as releaseStorageBuffer } from "./BufferManagerReleaseStorageBufferUseCase";
import { execute as cleanupStorageBuffers } from "./BufferManagerCleanupStorageBuffersUseCase";

describe("BufferManagerAcquireStorageBufferUseCase", () =>
{
    let mockDevice: GPUDevice;
    let pool: IPooledStorageBuffer[];

    beforeEach(() =>
    {
        mockDevice = {} as GPUDevice;
        pool = [];
        vi.clearAllMocks();
    });

    describe("execute", () =>
    {
        it("should create new buffer when pool is empty", () =>
        {
            const buffer = execute(mockDevice, pool, 1024, 0);

            expect(buffer).toBeDefined();
            expect(pool.length).toBe(1);
            expect(pool[0].inUse).toBe(true);
        });

        it("should reuse buffer from pool if size matches", () =>
        {
            // First allocation
            const buffer1 = execute(mockDevice, pool, 1024, 0);
            releaseStorageBuffer(pool, buffer1);

            // Second allocation should reuse
            const buffer2 = execute(mockDevice, pool, 512, 1);

            expect(buffer2).toBe(buffer1);
            expect(pool.length).toBe(1);
        });

        it("should align size to 256 bytes", () =>
        {
            execute(mockDevice, pool, 100, 0);

            // 100 bytes should be aligned to 256
            expect(pool[0].size).toBeGreaterThanOrEqual(256);
        });

        it("should select best fit buffer", () =>
        {
            // Create buffers of different sizes
            const small = execute(mockDevice, pool, 256, 0);
            const large = execute(mockDevice, pool, 4096, 0);

            releaseStorageBuffer(pool, small);
            releaseStorageBuffer(pool, large);

            // Request medium size - should get small (closest fit)
            const result = execute(mockDevice, pool, 256, 1);

            expect(result).toBe(small);
        });

        it("should set lastUsedFrame correctly", () =>
        {
            const frameNumber = 42;
            execute(mockDevice, pool, 1024, frameNumber);

            expect(pool[0].lastUsedFrame).toBe(frameNumber);
        });
    });

    describe("releaseStorageBuffer", () =>
    {
        it("should mark buffer as not in use", () =>
        {
            const buffer = execute(mockDevice, pool, 1024, 0);
            expect(pool[0].inUse).toBe(true);

            releaseStorageBuffer(pool, buffer);
            expect(pool[0].inUse).toBe(false);
        });

        it("should handle buffer not in pool", () =>
        {
            const fakeBuffer = {} as GPUBuffer;

            // Should not throw
            expect(() => releaseStorageBuffer(pool, fakeBuffer)).not.toThrow();
        });
    });

    describe("cleanupStorageBuffers", () =>
    {
        it("should remove old unused buffers", () =>
        {
            // Create and release a buffer at frame 0
            const oldBuffer = execute(mockDevice, pool, 1024, 0);
            releaseStorageBuffer(pool, oldBuffer);

            // Cleanup at frame 100 with maxAge 60
            cleanupStorageBuffers(pool, 100, 60);

            expect(pool.length).toBe(0);
        });

        it("should keep recently used buffers", () =>
        {
            // Create and release at frame 50
            const buffer = execute(mockDevice, pool, 1024, 50);
            releaseStorageBuffer(pool, buffer);

            // Cleanup at frame 100 with maxAge 60 - buffer is only 50 frames old
            cleanupStorageBuffers(pool, 100, 60);

            expect(pool.length).toBe(1);
        });

        it("should keep buffers that are in use", () =>
        {
            // Create buffer but don't release
            execute(mockDevice, pool, 1024, 0);

            // Cleanup at frame 100
            cleanupStorageBuffers(pool, 100, 60);

            expect(pool.length).toBe(1);
        });

        it("should use default maxAge of 60", () =>
        {
            const buffer = execute(mockDevice, pool, 1024, 0);
            releaseStorageBuffer(pool, buffer);

            // Frame 61 - just over the default maxAge
            cleanupStorageBuffers(pool, 61);

            expect(pool.length).toBe(0);
        });
    });
});
