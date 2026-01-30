import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPooledBuffer } from "../../interface/IPooledBuffer";
import { execute } from "./BufferManagerAcquireVertexBufferUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    VERTEX: 0x0020,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("BufferManagerAcquireVertexBufferUseCase", () =>
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
            })),
            "queue": {
                "writeBuffer": vi.fn()
            }
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

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalled();
    });

    it("should create buffer with power of two size", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 100); // Should round up to 128

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 128 })
        );
    });

    it("should create buffer with correct usage flags", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalledWith({
            "size": 256,
            "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
    });

    it("should return smallest suitable buffer from pool", () =>
    {
        const medium = createPoolEntry(300); // Within 2x of 256
        const small = createPoolEntry(256);  // Exact match
        const large = createPoolEntry(400);  // Within 2x but larger
        pool.push(medium, small, large);
        const device = createMockDevice();

        const result = execute(device, pool, 256);

        expect(result).toBe(small.buffer); // Should pick smallest
    });

    it("should skip buffer too large (> 2x)", () =>
    {
        const entry = createPoolEntry(1024); // More than 2x of 256
        pool.push(entry);
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalled();
        expect(pool.length).toBe(1);
    });

    it("should skip buffer too small", () =>
    {
        const entry = createPoolEntry(64);
        pool.push(entry);
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.createBuffer).toHaveBeenCalled();
        expect(pool.length).toBe(1);
    });

    it("should write data to buffer if provided", () =>
    {
        const device = createMockDevice();
        const data = new Float32Array([1, 2, 3, 4]);

        execute(device, pool, 256, data);

        expect(device.queue.writeBuffer).toHaveBeenCalled();
    });

    it("should not write data if not provided", () =>
    {
        const device = createMockDevice();

        execute(device, pool, 256);

        expect(device.queue.writeBuffer).not.toHaveBeenCalled();
    });

    it("should write data to pooled buffer", () =>
    {
        const entry = createPoolEntry(256);
        pool.push(entry);
        const device = createMockDevice();
        const data = new Float32Array([1, 2, 3, 4]);

        const result = execute(device, pool, 256, data);

        expect(result).toBe(entry.buffer);
        expect(device.queue.writeBuffer).toHaveBeenCalledWith(
            entry.buffer,
            0,
            data.buffer,
            data.byteOffset,
            data.byteLength
        );
    });

    it("should handle data with byte offset", () =>
    {
        const device = createMockDevice();
        const buffer = new ArrayBuffer(64);
        const data = new Float32Array(buffer, 16, 4); // Offset of 16 bytes

        execute(device, pool, 256, data);

        expect(device.queue.writeBuffer).toHaveBeenCalledWith(
            expect.anything(),
            0,
            buffer,
            16, // byteOffset
            16  // byteLength (4 floats * 4 bytes)
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
