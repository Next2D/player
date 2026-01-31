import { describe, it, expect, vi } from "vitest";
import { execute } from "./AttachmentManagerCreateTextureObjectService";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    RENDER_ATTACHMENT: 0x10,
    TEXTURE_BINDING: 0x04,
    COPY_SRC: 0x01,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("AttachmentManagerCreateTextureObjectService", () =>
{
    const createMockDevice = () =>
    {
        const mockView = { "label": "mockView" };
        const mockTexture = {
            "createView": vi.fn(() => mockView)
        };

        return {
            "createTexture": vi.fn(() => mockTexture),
            "_mockTexture": mockTexture,
            "_mockView": mockView
        } as unknown as GPUDevice & { _mockTexture: any; _mockView: any };
    };

    describe("texture creation", () =>
    {
        it("should create texture with correct size", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            execute(device, 256, 128, true, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 256, "height": 128 }
                })
            );
        });

        it("should create texture with rgba8unorm format", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            execute(device, 256, 128, true, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba8unorm"
                })
            );
        });

        it("should create texture with correct usage flags", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            execute(device, 256, 128, true, idCounter);

            const expectedUsage =
                GPUTextureUsage.RENDER_ATTACHMENT |
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_SRC |
                GPUTextureUsage.COPY_DST;

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "usage": expectedUsage
                })
            );
        });

        it("should create view from texture", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            execute(device, 256, 128, true, idCounter);

            expect((device as any)._mockTexture.createView).toHaveBeenCalled();
        });
    });

    describe("returned texture object", () =>
    {
        it("should return object with incremented id", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 5 };

            const result = execute(device, 256, 128, true, idCounter);

            expect(result.id).toBe(5);
            expect(idCounter.textureId).toBe(6);
        });

        it("should return object with texture resource", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 256, 128, true, idCounter);

            expect(result.resource).toBe((device as any)._mockTexture);
        });

        it("should return object with view", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 256, 128, true, idCounter);

            expect(result.view).toBe((device as any)._mockView);
        });

        it("should return object with correct width", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 512, 256, true, idCounter);

            expect(result.width).toBe(512);
        });

        it("should return object with correct height", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 512, 256, true, idCounter);

            expect(result.height).toBe(256);
        });

        it("should return object with calculated area", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 100, 50, true, idCounter);

            expect(result.area).toBe(5000); // 100 * 50
        });

        it("should return object with smooth flag when true", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 256, 128, true, idCounter);

            expect(result.smooth).toBe(true);
        });

        it("should return object with smooth flag when false", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 1 };

            const result = execute(device, 256, 128, false, idCounter);

            expect(result.smooth).toBe(false);
        });
    });

    describe("id counter behavior", () =>
    {
        it("should increment id for each call", () =>
        {
            const device = createMockDevice();
            const idCounter = { textureId: 10 };

            const result1 = execute(device, 256, 128, true, idCounter);
            const result2 = execute(device, 256, 128, true, idCounter);
            const result3 = execute(device, 256, 128, true, idCounter);

            expect(result1.id).toBe(10);
            expect(result2.id).toBe(11);
            expect(result3.id).toBe(12);
            expect(idCounter.textureId).toBe(13);
        });
    });
});
