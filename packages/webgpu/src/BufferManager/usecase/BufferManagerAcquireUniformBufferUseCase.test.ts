import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPooledBuffer } from "../../interface/IPooledBuffer";
import { execute } from "./BufferManagerAcquireUniformBufferUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x0040,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("BufferManagerAcquireUniformBufferUseCase", () =>
{
    let pool: IPooledBuffer[];

    const createMockDevice = () =>
    {
        let bufferId = 0;
        return {
            "createBuffer": vi.fn((descriptor) => ({
                "id": ++bufferId,
                "size": descriptor.size,
                "usage": descriptor.usage
            }))
        } as unknown as GPUDevice;
    };

    const createPoolEntry = (size: number): IPooledBuffer =>
    {
        return {
            "buffer": { "size": size, "id": Math.random() } as unknown as GPUBuffer,
            size
        };
    };

    beforeEach(() =>
    {
        pool = [];
    });

    it("should return buffer from pool if size matches", () =>
    {
        const entry = createPoolEntry(256);
        pool.push(entry);
        const device = createMockDevice();

        const result = execute(device, pool, 256);

        expect(result).toBe(entry.buffer);
        expect(pool.length).toBe(0);
        expect(device.createBuffer).not.toHaveBeenCalled();
    });

    it("should create new buffer if pool is empty", () =>
    {
        const device = createMockDevice();

        const result = execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalledWith({
            "size": 256,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    });

    it("should align size to 16 bytes", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 100); // Should align to 112 (ceil(100/16)*16)

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 112 })
        );
    });

    it("should align size when requesting exact multiple of 16", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 64); // Already aligned

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 64 })
        );
    });

    it("should return buffer from pool within 2x size range", () =>
    {
        const entry = createPoolEntry(400); // Within 2x of aligned 256
        pool.push(entry);
        const device = createMockDevice();

        const result = execute(device, pool, 256);

        expect(result).toBe(entry.buffer);
        expect(device.createBuffer).not.toHaveBeenCalled();
    });

    it("should skip buffer too large (> 2x)", () =>
    {
        const entry = createPoolEntry(1024); // More than 2x of 256
        pool.push(entry);
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalled();
        expect(pool.length).toBe(1); // Entry not consumed
    });

    it("should skip buffer too small", () =>
    {
        const entry = createPoolEntry(64);
        pool.push(entry);
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalled();
        expect(pool.length).toBe(1); // Entry not consumed
    });

    it("should pick first suitable buffer from pool", () =>
    {
        const small = createPoolEntry(64);
        const suitable = createPoolEntry(256);
        const large = createPoolEntry(1024);
        pool.push(small, suitable, large);
        const device = createMockDevice();

        const result = execute(device, pool, 256);

        expect(result).toBe(suitable.buffer);
        expect(pool.length).toBe(2);
    });

    it("should handle very small sizes", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 1);

        // Should align to 16
        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 16 })
        );
    });

    it("should remove acquired entry from pool", () =>
    {
        pool.push(createPoolEntry(256));
        pool.push(createPoolEntry(512));
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(pool.length).toBe(1);
        expect(pool[0].size).toBe(512);
    });
});
