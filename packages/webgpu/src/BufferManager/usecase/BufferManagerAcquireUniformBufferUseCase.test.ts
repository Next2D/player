import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./BufferManagerAcquireUniformBufferUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x0040,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("BufferManagerAcquireUniformBufferUseCase", () =>
{
    let buckets: Map<number, GPUBuffer[]>;

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

        const result = execute(device, buckets, 256);

        expect(device.createBuffer).toHaveBeenCalledWith({
            "size": 256,
            "usage": GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    });

    it("should align size to 16 bytes", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 100); // Should align to 112 (ceil(100/16)*16)

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 112 })
        );
    });

    it("should align size when requesting exact multiple of 16", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 64); // Already aligned

        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 64 })
        );
    });

    it("should return buffer from bucket with aligned size", () =>
    {
        // 100 aligns to 112
        const buffer = createMockBuffer(112);
        buckets.set(112, [buffer]);
        const device = createMockDevice();

        const result = execute(device, buckets, 100);

        expect(result).toBe(buffer);
        expect(device.createBuffer).not.toHaveBeenCalled();
    });

    it("should handle very small sizes", () =>
    {
        const device = createMockDevice();

        execute(device, buckets, 1);

        // Should align to 16
        expect(device.createBuffer).toHaveBeenCalledWith(
            expect.objectContaining({ "size": 16 })
        );
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
