import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    $setFilterGradientLUTDevice,
    $getFilterGradientAttachmentObject,
    $clearFilterGradientAttachment
} from "./FilterGradientLUTCache";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("FilterGradientLUTCache", () =>
{
    const createMockDevice = () =>
    {
        const mockTexture = {
            "createView": vi.fn(() => ({ "label": "mockView" })),
            "destroy": vi.fn()
        };
        return {
            "createTexture": vi.fn(() => mockTexture),
            "_mockTexture": mockTexture
        } as unknown as GPUDevice & { _mockTexture: any };
    };

    beforeEach(() =>
    {
        // Clear cache before each test
        $clearFilterGradientAttachment();
    });

    describe("$setFilterGradientLUTDevice", () =>
    {
        it("should set the device for texture creation", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            // Getting an attachment should now use the device
            const attachment = $getFilterGradientAttachmentObject();

            expect(device.createTexture).toHaveBeenCalled();
            expect(attachment).toBeDefined();
        });
    });

    describe("$getFilterGradientAttachmentObject", () =>
    {
        it("should create attachment with 256x1 dimensions", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            const attachment = $getFilterGradientAttachmentObject();

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 256, "height": 1 },
                    "format": "rgba8unorm"
                })
            );
            expect(attachment.width).toBe(256);
            expect(attachment.height).toBe(1);
        });

        it("should cache attachment and return same instance", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            const attachment1 = $getFilterGradientAttachmentObject();
            const attachment2 = $getFilterGradientAttachmentObject();

            // Should return the same attachment
            expect(attachment1).toBe(attachment2);
            // Should only create texture once
            expect(device.createTexture).toHaveBeenCalledTimes(1);
        });

        it("should set correct attachment properties", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            const attachment = $getFilterGradientAttachmentObject();

            expect(attachment.id).toBe(-256);  // Negative ID for filter
            expect(attachment.width).toBe(256);
            expect(attachment.height).toBe(1);
            expect(attachment.clipLevel).toBe(0);
            expect(attachment.msaa).toBe(false);
            expect(attachment.mask).toBe(false);
            expect(attachment.color).toBe(null);
            expect(attachment.texture).toBeDefined();
            expect(attachment.stencil).toBe(null);
            expect(attachment.msaaTexture).toBe(null);
            expect(attachment.msaaStencil).toBe(null);
        });

        it("should set correct texture properties", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            const attachment = $getFilterGradientAttachmentObject();

            expect(attachment.texture!.id).toBe(-256);
            expect(attachment.texture!.width).toBe(256);
            expect(attachment.texture!.height).toBe(1);
            expect(attachment.texture!.area).toBe(256);
            expect(attachment.texture!.smooth).toBe(true);
        });
    });

    describe("$clearFilterGradientAttachment", () =>
    {
        it("should destroy cached texture", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            // Create an attachment
            $getFilterGradientAttachmentObject();

            // Clear should destroy texture
            $clearFilterGradientAttachment();

            expect(device._mockTexture.destroy).toHaveBeenCalled();
        });

        it("should clear cache so new attachment is created on next call", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            $getFilterGradientAttachmentObject();
            expect(device.createTexture).toHaveBeenCalledTimes(1);

            $clearFilterGradientAttachment();

            $getFilterGradientAttachmentObject();
            expect(device.createTexture).toHaveBeenCalledTimes(2);
        });

        it("should not throw when attachment is null", () =>
        {
            expect(() => $clearFilterGradientAttachment()).not.toThrow();
        });
    });

    describe("texture usage flags", () =>
    {
        it("should create texture with correct usage flags", () =>
        {
            const device = createMockDevice();
            $setFilterGradientLUTDevice(device);

            $getFilterGradientAttachmentObject();

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "usage": GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
                })
            );
        });
    });
});
