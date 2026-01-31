import { describe, it, expect, vi, beforeEach } from "vitest";
import { execute } from "./TextureManagerCreateTextureFromImageBitmapUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("TextureManagerCreateTextureFromImageBitmapUseCase", () =>
{
    const createMockDevice = () =>
    {
        const mockTexture = { "label": "mockTexture" };
        return {
            "createTexture": vi.fn(() => mockTexture),
            "queue": {
                "copyExternalImageToTexture": vi.fn()
            },
            "_mockTexture": mockTexture
        } as unknown as GPUDevice & { _mockTexture: any };
    };

    const createMockImageBitmap = (width: number = 100, height: number = 100): ImageBitmap =>
    {
        return { width, height } as unknown as ImageBitmap;
    };

    describe("texture creation", () =>
    {
        it("should create texture with ImageBitmap dimensions", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap(512, 256);

            execute(device, textures, "test", imageBitmap);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 512, "height": 256 }
                })
            );
        });

        it("should create texture with rgba8unorm format", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

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
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

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

    describe("image copy", () =>
    {
        it("should copy ImageBitmap to texture", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

            expect(device.queue.copyExternalImageToTexture).toHaveBeenCalled();
        });

        it("should use ImageBitmap as source with flipY", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

            expect(device.queue.copyExternalImageToTexture).toHaveBeenCalledWith(
                { "source": imageBitmap, "flipY": true },
                expect.anything(),
                expect.anything()
            );
        });

        it("should copy to created texture with premultipliedAlpha", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

            expect(device.queue.copyExternalImageToTexture).toHaveBeenCalledWith(
                expect.anything(),
                expect.objectContaining({
                    "texture": (device as any)._mockTexture,
                    "premultipliedAlpha": true
                }),
                expect.anything()
            );
        });

        it("should use ImageBitmap dimensions for copy size", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const imageBitmap = createMockImageBitmap(320, 240);

            execute(device, textures, "test", imageBitmap);

            expect(device.queue.copyExternalImageToTexture).toHaveBeenCalledWith(
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
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "myBitmapTexture", imageBitmap);

            expect(textures.has("myBitmapTexture")).toBe(true);
            expect(textures.get("myBitmapTexture")).toBe((device as any)._mockTexture);
        });

        it("should overwrite existing texture with same name", () =>
        {
            const device = createMockDevice();
            const textures = new Map<string, GPUTexture>();
            const existingTexture = { "label": "existing" } as unknown as GPUTexture;
            textures.set("test", existingTexture);
            const imageBitmap = createMockImageBitmap();

            execute(device, textures, "test", imageBitmap);

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
            const imageBitmap = createMockImageBitmap();

            const result = execute(device, textures, "test", imageBitmap);

            expect(result).toBe((device as any)._mockTexture);
        });
    });
});
