import { describe, it, expect, vi, beforeEach } from "vitest";
import {
    $setGradientLUTDevice,
    $getGradientAttachmentObjectWithResolution,
    $getGradientAttachmentObject,
    $clearGradientAttachmentObjects
} from "./GradientLUTCache";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02,
    RENDER_ATTACHMENT: 0x10
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("GradientLUTCache", () =>
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
        $clearGradientAttachmentObjects();
    });

    describe("$setGradientLUTDevice", () =>
    {
        it("should set the device for texture creation", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            // Getting an attachment should now use the device
            const attachment = $getGradientAttachmentObject();

            expect(device.createTexture).toHaveBeenCalled();
            expect(attachment).toBeDefined();
        });
    });

    describe("$getGradientAttachmentObjectWithResolution", () =>
    {
        it("should create attachment with specified resolution", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            const attachment = $getGradientAttachmentObjectWithResolution(512);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 512, "height": 1 },
                    "format": "rgba8unorm"
                })
            );
            expect(attachment.width).toBe(512);
            expect(attachment.height).toBe(1);
        });

        it("should cache attachments by resolution", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            const attachment1 = $getGradientAttachmentObjectWithResolution(256);
            const attachment2 = $getGradientAttachmentObjectWithResolution(256);

            // Should return the same attachment
            expect(attachment1).toBe(attachment2);
            // Should only create texture once
            expect(device.createTexture).toHaveBeenCalledTimes(1);
        });

        it("should create separate attachments for different resolutions", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            const attachment256 = $getGradientAttachmentObjectWithResolution(256);
            const attachment512 = $getGradientAttachmentObjectWithResolution(512);

            expect(attachment256).not.toBe(attachment512);
            expect(attachment256.width).toBe(256);
            expect(attachment512.width).toBe(512);
            expect(device.createTexture).toHaveBeenCalledTimes(2);
        });

        it("should set correct attachment properties", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            const attachment = $getGradientAttachmentObjectWithResolution(256);

            expect(attachment.id).toBe(256);
            expect(attachment.width).toBe(256);
            expect(attachment.height).toBe(1);
            expect(attachment.clipLevel).toBe(0);
            expect(attachment.msaa).toBe(false);
            expect(attachment.mask).toBe(false);
            expect(attachment.texture).toBeDefined();
            expect(attachment.stencil).toBe(null);
        });
    });

    describe("$getGradientAttachmentObject", () =>
    {
        it("should return default 256 resolution attachment", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            const attachment = $getGradientAttachmentObject();

            expect(attachment.width).toBe(256);
            expect(attachment.height).toBe(1);
        });
    });

    describe("$clearGradientAttachmentObjects", () =>
    {
        it("should destroy all cached textures", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            // Create multiple attachments
            $getGradientAttachmentObjectWithResolution(256);
            $getGradientAttachmentObjectWithResolution(512);

            // Clear should destroy textures
            $clearGradientAttachmentObjects();

            expect(device._mockTexture.destroy).toHaveBeenCalled();
        });

        it("should clear cache so new attachments are created", () =>
        {
            const device = createMockDevice();
            $setGradientLUTDevice(device);

            $getGradientAttachmentObjectWithResolution(256);
            expect(device.createTexture).toHaveBeenCalledTimes(1);

            $clearGradientAttachmentObjects();

            $getGradientAttachmentObjectWithResolution(256);
            expect(device.createTexture).toHaveBeenCalledTimes(2);
        });
    });
});
