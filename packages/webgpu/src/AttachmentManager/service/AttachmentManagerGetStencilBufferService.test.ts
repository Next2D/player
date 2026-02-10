import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute } from "./AttachmentManagerGetStencilBufferService";

// Mock the create service
vi.mock("./AttachmentManagerCreateStencilBufferService", () => ({
    "execute": vi.fn((device, width, height, idCounter) => {
        const id = ++idCounter.stencilId;
        return {
            id,
            width,
            height,
            "dirty": false,
            "resource": {},
            "view": {}
        };
    })
}));

describe("AttachmentManagerGetStencilBufferService", () =>
{
    let stencilBufferPool: IStencilBufferObject[];
    let idCounter: { stencilId: number };

    const createMockDevice = () =>
    {
        return {} as GPUDevice;
    };

    const createPoolEntry = (
        width: number,
        height: number
    ): IStencilBufferObject => ({
        "id": Math.random(),
        width,
        height,
        "dirty": true,
        "resource": {} as GPUTexture,
        "view": {} as GPUTextureView
    });

    beforeEach(() =>
    {
        stencilBufferPool = [];
        idCounter = { "stencilId": 0 };
        vi.clearAllMocks();
    });

    it("should return buffer from pool if size matches", () =>
    {
        const entry = createPoolEntry(256, 256);
        stencilBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result).toBe(entry);
        expect(stencilBufferPool.length).toBe(0);
    });

    it("should reset dirty flag when acquiring from pool", () =>
    {
        const entry = createPoolEntry(256, 256);
        entry.dirty = true;
        stencilBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result.dirty).toBe(false);
    });

    it("should accept larger buffer from pool", () =>
    {
        const largerEntry = createPoolEntry(512, 512);
        stencilBufferPool.push(largerEntry);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result).toBe(largerEntry);
    });

    it("should skip smaller buffer in pool", () =>
    {
        const smallEntry = createPoolEntry(128, 128);
        stencilBufferPool.push(smallEntry);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result).not.toBe(smallEntry);
        expect(stencilBufferPool.length).toBe(1);
    });

    it("should create new buffer when pool is empty", () =>
    {
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result.width).toBe(256);
        expect(result.height).toBe(256);
    });

    it("should increment id counter when creating new", () =>
    {
        const device = createMockDevice();

        execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(idCounter.stencilId).toBe(1);
    });

    it("should pick first suitable buffer", () =>
    {
        const entry1 = createPoolEntry(512, 512);
        const entry2 = createPoolEntry(256, 256);
        stencilBufferPool.push(entry1, entry2);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 256, 256, idCounter);

        expect(result).toBe(entry1);
    });

    it("should handle non-square dimensions", () =>
    {
        const entry = createPoolEntry(1024, 512);
        stencilBufferPool.push(entry);
        const device = createMockDevice();

        const result = execute(device, stencilBufferPool, 800, 400, idCounter);

        expect(result).toBe(entry);
    });
});
