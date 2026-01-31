import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IPooledTexture } from "../../interface/IPooledTexture";
import { execute } from "./TexturePoolAcquireUseCase";

describe("TexturePoolAcquireUseCase", () =>
{
    let pool: IPooledTexture[];

    const createMockDevice = () =>
    {
        let textureId = 0;
        return {
            "createTexture": vi.fn((descriptor) => ({
                "id": ++textureId,
                "width": descriptor.size.width,
                "height": descriptor.size.height,
                "format": descriptor.format,
                "destroy": vi.fn()
            }))
        } as unknown as GPUDevice;
    };

    const createPoolEntry = (
        width: number,
        height: number,
        format: GPUTextureFormat = "rgba8unorm",
        inUse: boolean = false,
        lastUsedFrame: number = 0
    ): IPooledTexture => ({
        "texture": { "id": Math.random(), "destroy": vi.fn() } as unknown as GPUTexture,
        width,
        height,
        format,
        inUse,
        lastUsedFrame
    });

    beforeEach(() =>
    {
        pool = [];
    });

    describe("pool matching", () =>
    {
        it("should return exact match from pool", () =>
        {
            const entry = createPoolEntry(256, 256, "rgba8unorm", false, 0);
            pool.push(entry);
            const device = createMockDevice();

            const result = execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(result).toBe(entry.texture);
            expect(entry.inUse).toBe(true);
            expect(entry.lastUsedFrame).toBe(100);
            expect(device.createTexture).not.toHaveBeenCalled();
        });

        it("should skip entries that are in use", () =>
        {
            const inUseEntry = createPoolEntry(256, 256, "rgba8unorm", true);
            const availableEntry = createPoolEntry(256, 256, "rgba8unorm", false);
            pool.push(inUseEntry, availableEntry);
            const device = createMockDevice();

            const result = execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(result).toBe(availableEntry.texture);
            expect(inUseEntry.inUse).toBe(true); // Still in use
        });

        it("should skip entries with different format", () =>
        {
            const wrongFormat = createPoolEntry(256, 256, "bgra8unorm", false);
            pool.push(wrongFormat);
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(device.createTexture).toHaveBeenCalled();
        });

        it("should accept larger texture within 2x bounds", () =>
        {
            const largerEntry = createPoolEntry(400, 400, "rgba8unorm", false);
            pool.push(largerEntry);
            const device = createMockDevice();

            const result = execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(result).toBe(largerEntry.texture);
            expect(device.createTexture).not.toHaveBeenCalled();
        });

        it("should reject texture larger than 2x", () =>
        {
            const tooLarge = createPoolEntry(600, 600, "rgba8unorm", false);
            pool.push(tooLarge);
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(device.createTexture).toHaveBeenCalled();
        });

        it("should prefer exact match over larger", () =>
        {
            const larger = createPoolEntry(300, 300, "rgba8unorm", false);
            const exact = createPoolEntry(256, 256, "rgba8unorm", false);
            pool.push(larger, exact);
            const device = createMockDevice();

            const result = execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(result).toBe(exact.texture);
        });

        it("should pick smallest fitting texture when no exact match", () =>
        {
            const large = createPoolEntry(400, 400, "rgba8unorm", false);
            const medium = createPoolEntry(300, 300, "rgba8unorm", false);
            pool.push(large, medium);
            const device = createMockDevice();

            const result = execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(result).toBe(medium.texture);
        });
    });

    describe("texture creation", () =>
    {
        it("should create new texture when pool is empty", () =>
        {
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0x10, 100, 32);

            expect(device.createTexture).toHaveBeenCalledWith({
                "size": { "width": 256, "height": 256 },
                "format": "rgba8unorm",
                "usage": 0x10
            });
        });

        it("should add new texture to pool", () =>
        {
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(pool.length).toBe(1);
            expect(pool[0].width).toBe(256);
            expect(pool[0].height).toBe(256);
            expect(pool[0].inUse).toBe(true);
            expect(pool[0].lastUsedFrame).toBe(100);
        });

        it("should evict oldest when pool is full", () =>
        {
            const device = createMockDevice();

            // Fill pool with maxPoolSize entries
            for (let i = 0; i < 4; i++) {
                pool.push(createPoolEntry(128, 128, "rgba8unorm", false, i));
            }

            execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 4);

            // Pool should still be at max size
            expect(pool.length).toBe(4);
        });
    });

    describe("frame tracking", () =>
    {
        it("should update lastUsedFrame when acquiring from pool", () =>
        {
            const entry = createPoolEntry(256, 256, "rgba8unorm", false, 50);
            pool.push(entry);
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0, 200, 32);

            expect(entry.lastUsedFrame).toBe(200);
        });

        it("should mark texture as in use", () =>
        {
            const entry = createPoolEntry(256, 256, "rgba8unorm", false);
            pool.push(entry);
            const device = createMockDevice();

            execute(device, pool, 256, 256, "rgba8unorm", 0, 100, 32);

            expect(entry.inUse).toBe(true);
        });
    });
});
