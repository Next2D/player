import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute } from "./AttachmentManagerGetColorBufferService";

// Mock the create service
vi.mock("./AttachmentManagerCreateColorBufferService", () => ({
    "execute": vi.fn((device, width, height, stencil) => ({
        "id": Math.random(),
        width,
        height,
        stencil,
        "dirty": false,
        "resource": {},
        "view": {}
    }))
}));

describe("AttachmentManagerGetColorBufferService", () =>
{
    let colorBufferPool: IColorBufferObject[];
    let mockStencil: IStencilBufferObject;

    const createMockDevice = () =>
    {
        return {} as GPUDevice;
    };

    const createPoolEntry = (
        width: number,
        height: number
    ): IColorBufferObject => ({
        "id": Math.random(),
        width,
        height,
        "stencil": null as unknown as IStencilBufferObject,
        "dirty": true,
        "resource": {} as GPUTexture,
        "view": {} as GPUTextureView
    });

    beforeEach(() =>
    {
        colorBufferPool = [];
        mockStencil = { "id": 1 } as IStencilBufferObject;
        vi.clearAllMocks();
    });

    it("should return buffer from pool if size matches", () =>
    {
        const entry = createPoolEntry(256, 256);
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).toBe(entry);
        expect(colorBufferPool.length).toBe(0); // Removed from pool
    });

    it("should update stencil reference when acquiring from pool", () =>
    {
        const entry = createPoolEntry(256, 256);
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result.stencil).toBe(mockStencil);
    });

    it("should reset dirty flag when acquiring from pool", () =>
    {
        const entry = createPoolEntry(256, 256);
        entry.dirty = true;
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result.dirty).toBe(false);
    });

    it("should accept larger buffer from pool", () =>
    {
        const largerEntry = createPoolEntry(512, 512);
        colorBufferPool.push(largerEntry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).toBe(largerEntry);
    });

    it("should skip smaller buffer in pool", () =>
    {
        const smallEntry = createPoolEntry(128, 128);
        colorBufferPool.push(smallEntry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).not.toBe(smallEntry);
        expect(colorBufferPool.length).toBe(1); // Small entry still in pool
    });

    it("should pick first suitable buffer", () =>
    {
        const entry1 = createPoolEntry(512, 512);
        const entry2 = createPoolEntry(256, 256);
        colorBufferPool.push(entry1, entry2);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).toBe(entry1); // First one that fits
        expect(colorBufferPool.length).toBe(1);
    });

    it("should create new buffer when pool is empty", () =>
    {
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result.width).toBe(256);
        expect(result.height).toBe(256);
    });

    it("should handle non-square dimensions", () =>
    {
        const entry = createPoolEntry(1024, 512);
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 800, 400, mockStencil);

        expect(result).toBe(entry);
    });

    it("should reject buffer with insufficient width", () =>
    {
        const entry = createPoolEntry(200, 512);
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).not.toBe(entry);
    });

    it("should reject buffer with insufficient height", () =>
    {
        const entry = createPoolEntry(512, 200);
        colorBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, colorBufferPool, 256, 256, mockStencil);

        expect(result).not.toBe(entry);
    });
});
