import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute } from "./AttachmentManagerCreateColorBufferService";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    RENDER_ATTACHMENT: 0x10,
    TEXTURE_BINDING: 0x04,
    COPY_SRC: 0x01,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("AttachmentManagerCreateColorBufferService", () =>
{
    let mockStencil: IStencilBufferObject;

    const createMockDevice = () =>
    {
        const mockView = { "label": "mockView" };
        const mockTexture = {
            "createView": vi.fn(() => mockView),
            "width": 0,
            "height": 0
        };
        return {
            "createTexture": vi.fn((descriptor) => {
                mockTexture.width = descriptor.size.width;
                mockTexture.height = descriptor.size.height;
                return mockTexture;
            }),
            "_mockTexture": mockTexture,
            "_mockView": mockView
        } as unknown as GPUDevice & { _mockTexture: any; _mockView: any };
    };

    beforeEach(() =>
    {
        mockStencil = { "id": 1 } as IStencilBufferObject;
    });

    it("should create texture with correct dimensions", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 512, mockStencil);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "size": { "width": 256, "height": 512 }
            })
        );
    });

    it("should create texture with rgba8unorm format", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 256, mockStencil);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "format": "rgba8unorm"
            })
        );
    });

    it("should create texture with correct usage flags", () =>
    {
        const device = createMockDevice();
        const expectedUsage = GPUTextureUsage.RENDER_ATTACHMENT |
                             GPUTextureUsage.TEXTURE_BINDING |
                             GPUTextureUsage.COPY_SRC |
                             GPUTextureUsage.COPY_DST;

        execute(device, 256, 256, mockStencil);

        expect(device.createTexture).toHaveBeenCalledWith(
            expect.objectContaining({
                "usage": expectedUsage
            })
        );
    });

    it("should return object with resource property", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, mockStencil);

        expect(result.resource).toBeDefined();
    });

    it("should return object with view from createView", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, mockStencil);

        expect(result.view).toBe((device as any)._mockView);
    });

    it("should return object with correct dimensions", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 1024, 768, mockStencil);

        expect(result.width).toBe(1024);
        expect(result.height).toBe(768);
    });

    it("should return object with calculated area", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 100, 200, mockStencil);

        expect(result.area).toBe(20000);
    });

    it("should return object with stencil reference", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, mockStencil);

        expect(result.stencil).toBe(mockStencil);
    });

    it("should return object with dirty set to false", () =>
    {
        const device = createMockDevice();

        const result = execute(device, 256, 256, mockStencil);

        expect(result.dirty).toBe(false);
    });

    it("should call createView on texture", () =>
    {
        const device = createMockDevice();

        execute(device, 256, 256, mockStencil);

        expect((device as any)._mockTexture.createView).toHaveBeenCalled();
    });
});
