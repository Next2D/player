import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./BufferManagerAcquireVertexBufferUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    VERTEX: 0x0020,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("BufferManagerAcquireVertexBufferUseCase", () =>
{
    let buckets: Map<number, GPUBuffer[]>;

    const createMockDevice = () =>
    {
        let bufferId = 0;
        return {
            "createBuffer": vi.fn((descriptor) => ({
                "id": ++bufferId,
                "size": descriptor.size,
                "usage": descriptor.usage,
                "getMappedRange": vi.fn(() => new ArrayBuffer(descriptor.size)),
                "unmap": vi.fn()
            })),
            "queue": {
                "writeBuffer": vi.fn()
            }
        } as unknown as GPUDevice;
    };

    const createMockBuffer = (size: number): GPUBuffer => ({
        "size": size,
        "id": Math.random()
    } as unknown as GPUBuffer);

    beforeEach(() =>
    {
        buckets = new Map();
    });

    it("should return buffer from bucket if size matches", () =>
    {
        const buffer = createMockBuffer(256);
        buckets.set(256, [buffer]);
        const device = createMockDevice();

        const result = execute(device, buckets, 256);

        expect(result).toBe(buffer);
        expect(buckets.get(256)!.length).toBe(0);
        expect(device.createBuffer).not.toHaveBeenCalled();
    });

    it("should create new buffer if buckets are empty", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 256);

        expect(device.createBuffer).toHaveBeenCalled();
    });

    it("should create buffer with power of two size", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 100); // Should round up to 128

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 128 })
        );
    });

    it("should create buffer with correct usage flags", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 256);

        expect(device.createBuffer).toHaveBeenCalledWith({
            "size": 256,
            "usage": GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
        });
    });

    it("should return buffer from correct bucket for non-power-of-two size", () =>
    {
        // 100 rounds to 128
        const buffer = createMockBuffer(128);
        buckets.set(128, [buffer]);
        const device = createMockDevice();

        const result = execute(device, buckets, 100);

        expect(result).toBe(buffer);
        expect(device.createBuffer).not.toHaveBeenCalled();
    });

    it("should write data to buffer if provided", () =>
    {
        const device = createMockDevice();
        const data = new Float32Array([1, 2, 3, 4]);

        const result = execute(device, buckets, 256, data);

        // 新規バッファ + data有り: mappedAtCreation方式 (writeBufferは呼ばれない)
        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "mappedAtCreation": true })
        );
        expect((result as any).getMappedRange).toHaveBeenCalled();
        expect((result as any).unmap).toHaveBeenCalled();
    });

    it("should not write data if not provided", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 256);

        expect(device.queue.writeBuffer).not.toHaveBeenCalled();
    });

    it("should write data to pooled buffer", () =>
    {
        const buffer = createMockBuffer(256);
        buckets.set(256, [buffer]);
        const device = createMockDevice();
        const data = new Float32Array([1, 2, 3, 4]);

        const result = execute(device, buckets, 256, data);

        expect(result).toBe(buffer);
        expect(device.queue.writeBuffer).toHaveBeenCalledWith(
            buffer,
            0,
            data.buffer,
            data.byteOffset,
            data.byteLength
        );
    });

    it("should handle data with byte offset", () =>
    {
        const device = createMockDevice();
        const arrayBuffer = new ArrayBuffer(64);
        const data = new Float32Array(arrayBuffer, 16, 4); // Offset of 16 bytes

        const result = execute(device, buckets, 256, data);

        // 新規バッファ + data有り: mappedAtCreation方式
        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "mappedAtCreation": true })
        );
        expect((result as any).getMappedRange).toHaveBeenCalled();
        expect((result as any).unmap).toHaveBeenCalled();
    });

    it("should pop last buffer from bucket (LIFO)", () =>
    {
        const buffer1 = createMockBuffer(256);
        const buffer2 = createMockBuffer(256);
        buckets.set(256, [buffer1, buffer2]);
        const device = createMockDevice();

        const result = execute(device, buckets, 256);

        expect(result).toBe(buffer2); // LIFO: last in, first out
        expect(buckets.get(256)!.length).toBe(1);
        expect(buckets.get(256)![0]).toBe(buffer1);
    });
});
