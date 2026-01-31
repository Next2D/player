import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./TextureManagerCreateTextureFromPixelsUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("TextureManagerCreateTextureFromPixelsUseCase", () =>
{
    const createMockDevice = () =>
    {
        const mockTexture = { "label": "mockTexture" };
        return {
            "createTexture": vi.fn(() => mockTexture),
            "queue": {
                "writeTexture": vi.fn()
            },
            "_mockTexture": mockTexture
        } as unknown as GPUDevice & { _mockTexture: any };
    };

    describe("texture creation", () =>
    {
        it("should create texture with correct size", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(256 * 128 * 4);

            execute(device, textures, "test", pixels, 256, 128);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 256, "height": 128 }
                })
            );
        });

        it("should create texture with rgba8unorm format", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba8unorm"
                })
            );
        });

        it("should create texture with correct usage flags", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            const expectedUsage =
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT;

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "usage": expectedUsage
                })
            );
        });
    });

    describe("pixel data writing", () =>
    {
        it("should write pixel data to texture", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            expect(device.queue.writeTexture).toHaveBeenCalled();
        });

        it("should write to texture with correct target", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            expect(device.queue.writeTexture).toHaveBeenCalledWith(
                { "texture": (device as any)._mockTexture },
                expect.anything(),
                expect.anything(),
                expect.anything()
            );
        });

        it("should write with correct bytesPerRow", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(256 * 128 * 4);

            execute(device, textures, "test", pixels, 256, 128);

            expect(device.queue.writeTexture).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.objectContaining({
                    "bytesPerRow": 256 * 4 // width * 4 bytes per pixel
                }),
                expect.anything()
            );
        });

        it("should write with correct extent", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(320 * 240 * 4);

            execute(device, textures, "test", pixels, 320, 240);

            expect(device.queue.writeTexture).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                { "width": 320, "height": 240 }
            );
        });
    });

    describe("texture storage", () =>
    {
        it("should add texture to map with name", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "myTexture", pixels, 100, 100);

            expect(textures.has("myTexture")).toBe(true);
            expect(textures.get("myTexture")).toBe((device as any)._mockTexture);
        });

        it("should overwrite existing texture with same name", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const existingTexture = { "label": "existing" } as unknown as GPUTexture;
            textures.set("test", existingTexture);
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            expect(textures.get("test")).toBe((device as any)._mockTexture);
            expect(textures.get("test")).not.toBe(existingTexture);
        });
    });

    describe("return value", () =>
    {
        it("should return created texture", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            const result = execute(device, textures, "test", pixels, 100, 100);

            expect(result).toBe((device as any)._mockTexture);
        });
    });

    describe("byte offset handling", () =>
    {
        it("should pass pixel buffer to writeTexture", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const pixels = new Uint8Array(100 * 100 * 4);

            execute(device, textures, "test", pixels, 100, 100);

            expect(device.queue.writeTexture).toHaveBeenCalledWith(
                expect.anything(),
                pixels.buffer,
                expect.objectContaining({
                    "offset": 0
                }),
                expect.anything()
            );
        });
    });
});
