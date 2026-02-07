import { describe, it, expect, beforeEach, vi } from "vitest";
import { execute } from "./BufferManagerReleaseVertexBufferService";

describe("BufferManagerReleaseVertexBufferService", () =>
{
    let buckets: Map<number, GPUBuffer[]>;

    const createMockBuffer = (size: number): GPUBuffer => ({
        "size": size,
        "destroy": vi.fn()
    } as unknown as GPUBuffer);

    beforeEach(() =>
    {
        buckets = new Map();
    });

    it("should add buffer to correct bucket", () =>
    {
        const buffer = createMockBuffer(1024);

        execute(buckets, buffer);

        expect(buckets.has(1024)).toBe(true);
        expect(buckets.get(1024)!.length).toBe(1);
        expect(buckets.get(1024)![0]).toBe(buffer);
    });

    it("should add multiple buffers to same bucket", () =>
    {
        const buffer1 = createMockBuffer(512);
        const buffer2 = createMockBuffer(512);

        execute(buckets, buffer1);
        execute(buckets, buffer2);

        expect(buckets.get(512)!.length).toBe(2);
    });

    it("should add buffers to different buckets", () =>
    {
        const buffer1 = createMockBuffer(256);
        const buffer2 = createMockBuffer(512);

        execute(buckets, buffer1);
        execute(buckets, buffer2);

        expect(buckets.get(256)!.length).toBe(1);
        expect(buckets.get(512)!.length).toBe(1);
    });

    it("should destroy buffer when bucket is full", () =>
    {
        // Fill bucket to max (8)
        for (let i = 0; i < 8; i++) {
            const buf = createMockBuffer(1024);
            execute(buckets, buf);
        }

        const newBuffer = createMockBuffer(1024);
        execute(buckets, newBuffer);

        // Bucket stays at 8, new buffer destroyed
        expect(buckets.get(1024)!.length).toBe(8);
        expect(newBuffer.destroy).toHaveBeenCalled();
    });

    it("should not destroy buffer when bucket has space", () =>
    {
        const buffer = createMockBuffer(1024);

        execute(buckets, buffer);

        expect(buffer.destroy).not.toHaveBeenCalled();
        expect(buckets.get(1024)!.length).toBe(1);
    });

    it("should handle empty buckets map", () =>
    {
        const buffer = createMockBuffer(256);

        expect(() => execute(buckets, buffer)).not.toThrow();
        expect(buckets.get(256)!.length).toBe(1);
    });
});
