import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../interface/ITextureObject";
import { execute } from "./AttachmentManagerGetTextureService";

// Mock the create service
vi.mock("./AttachmentManagerCreateTextureObjectService", () => ({
    "execute": vi.fn((device, width, height, smooth, idCounter) => {
        const id = ++idCounter.textureId;
        return {
            id,
            width,
            height,
            smooth,
            "resource": {},
            "view": {}
        };
    })
}));

describe("AttachmentManagerGetTextureService", () =>
{
    let texturePool: Map<string, ITextureObject[]>;
    let idCounter: { textureId: number };

    const createMockDevice = () =>
    {
        return {} as GPUDevice;
    };

    const createPoolEntry = (
        width: number,
        height: number,
        smooth: boolean
    ): ITextureObject => ({
        "id": Math.random(),
        width,
        height,
        smooth,
        "resource": {} as GPUTexture,
        "view": {} as GPUTextureView
    });

    beforeEach(() =>
    {
        texturePool = new Map();
        idCounter = { "textureId": 0 };
        vi.clearAllMocks();
    });

    it("should return texture from pool if exact match exists", () =>
    {
        const entry = createPoolEntry(256, 256, true);
        texturePool.set("256x256_smooth", [entry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, true, idCounter);

        expect(result).toBe(entry);
        expect(texturePool.get("256x256_smooth")).toHaveLength(0);
    });

    it("should generate correct key for smooth textures", () =>
    {
        const entry = createPoolEntry(512, 512, true);
        texturePool.set("512x512_smooth", [entry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 512, 512, true, idCounter);

        expect(result).toBe(entry);
    });

    it("should generate correct key for nearest textures", () =>
    {
        const entry = createPoolEntry(256, 256, false);
        texturePool.set("256x256_nearest", [entry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, false, idCounter);

        expect(result).toBe(entry);
    });

    it("should not return smooth texture for nearest request", () =>
    {
        const smoothEntry = createPoolEntry(256, 256, true);
        texturePool.set("256x256_smooth", [smoothEntry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, false, idCounter);

        expect(result).not.toBe(smoothEntry);
    });

    it("should create new texture when pool is empty", () =>
    {
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, true, idCounter);

        expect(result.width).toBe(256);
        expect(result.height).toBe(256);
        expect(result.smooth).toBe(true);
    });

    it("should create new texture when key doesn't exist", () =>
    {
        texturePool.set("128x128_smooth", [createPoolEntry(128, 128, true)]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, true, idCounter);

        expect(result.width).toBe(256);
    });

    it("should increment id counter when creating new", () =>
    {
        const device = createMockDevice();

        execute(device, texturePool, 256, 256, true, idCounter);

        expect(idCounter.textureId).toBe(1);
    });

    it("should pop last entry from pool (LIFO)", () =>
    {
        const entry1 = createPoolEntry(256, 256, true);
        const entry2 = createPoolEntry(256, 256, true);
        texturePool.set("256x256_smooth", [entry1, entry2]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 256, 256, true, idCounter);

        expect(result).toBe(entry2); // Last one
        expect(texturePool.get("256x256_smooth")).toContain(entry1);
    });

    it("should handle non-square dimensions", () =>
    {
        const entry = createPoolEntry(1024, 512, false);
        texturePool.set("1024x512_nearest", [entry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 1024, 512, false, idCounter);

        expect(result).toBe(entry);
    });

    it("should not reuse texture with different dimensions", () =>
    {
        const entry = createPoolEntry(256, 256, true);
        texturePool.set("256x256_smooth", [entry]);
        const device = createMockDevice();

        const result = execute(device, texturePool, 512, 512, true, idCounter);

        expect(result).not.toBe(entry);
        expect(result.width).toBe(512);
    });
});
