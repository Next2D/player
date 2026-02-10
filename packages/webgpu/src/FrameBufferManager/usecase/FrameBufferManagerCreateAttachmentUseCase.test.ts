import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerCreateAttachmentUseCase";

// Mock $samples from WebGPUUtil
vi.mock("../../WebGPUUtil", () => ({
    "$samples": 1
}));

// Mock GPUTextureUsage
const GPUTextureUsage = {
    RENDER_ATTACHMENT: 0x10,
    TEXTURE_BINDING: 0x04,
    COPY_SRC: 0x01,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("FrameBufferManagerCreateAttachmentUseCase", () =>
{
    const createMockDevice = () =>
    {
        const mockView = { "label": "mockView" };
        const mockTexture = {
            "createView": vi.fn(() => mockView)
        };

        return {
            "createTexture": vi.fn(() => mockTexture),
            "_mockTexture": mockTexture
        } as unknown as GPUDevice;
    };

    describe("attachment creation", () =>
    {
        it("should create attachment with correct width", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 512, 256, false, false, idCounter
            );

            expect(result.width).toBe(512);
        });

        it("should create attachment with correct height", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 512, 256, false, false, idCounter
            );

            expect(result.height).toBe(256);
        });

        it("should increment attachment id", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 5, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, false, idCounter
            );

            expect(result.id).toBe(5);
            expect(idCounter.nextId).toBe(6);
        });

        it("should add attachment to map", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            execute(device, "bgra8unorm", attachments, "myAttachment", 256, 256, false, false, idCounter);

            expect(attachments.has("myAttachment")).toBe(true);
        });

        it("should set mask flag", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, true, idCounter
            );

            expect(result.mask).toBe(true);
        });

        it("should initialize clipLevel to 0", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, false, idCounter
            );

            expect(result.clipLevel).toBe(0);
        });
    });

    describe("texture format", () =>
    {
        it("should use rgba8unorm for atlas", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            execute(device, "bgra8unorm", attachments, "atlas", 256, 256, false, false, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba8unorm"
                })
            );
        });

        it("should use rgba8unorm for temp_ prefixed attachments", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            execute(device, "bgra8unorm", attachments, "temp_filter", 256, 256, false, false, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "rgba8unorm"
                })
            );
        });

        it("should use provided format for main attachment", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            execute(device, "bgra8unorm", attachments, "main", 256, 256, false, false, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "bgra8unorm"
                })
            );
        });
    });

    describe("texture object", () =>
    {
        it("should create texture object with correct dimensions", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 320, 240, false, false, idCounter
            );

            expect(result.texture).not.toBeNull();
            expect(result.texture?.width).toBe(320);
            expect(result.texture?.height).toBe(240);
        });

        it("should calculate texture area", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 100, 50, false, false, idCounter
            );

            expect(result.texture?.area).toBe(5000);
        });

        it("should increment texture id", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 10, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, false, idCounter
            );

            expect(result.texture?.id).toBe(10);
            expect(idCounter.textureId).toBe(11);
        });
    });

    describe("stencil buffer", () =>
    {
        it("should create stencil buffer for atlas", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "atlas", 256, 256, false, false, idCounter
            );

            expect(result.stencil).not.toBeNull();
        });

        it("should create stencil buffer for main", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "main", 256, 256, false, false, idCounter
            );

            expect(result.stencil).not.toBeNull();
        });

        it("should not create stencil buffer for other attachments", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "temp_filter", 256, 256, false, false, idCounter
            );

            expect(result.stencil).toBeNull();
        });

        it("should use stencil8 format for stencil buffer", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            execute(device, "bgra8unorm", attachments, "atlas", 256, 256, false, false, idCounter);

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "format": "stencil8"
                })
            );
        });
    });

    describe("color buffer", () =>
    {
        it("should not create color buffer", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, false, idCounter
            );

            expect(result.color).toBeNull();
        });
    });

    describe("MSAA", () =>
    {
        it("should not create MSAA texture when msaa is false", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, false, false, idCounter
            );

            expect(result.msaaTexture).toBeNull();
        });

        it("should set msaa flag on attachment", () =>
        {
            const device = createMockDevice();
            const attachments = new Map<string, IAttachmentObject>();
            const idCounter = { nextId: 1, textureId: 1, stencilId: 1 };

            const result = execute(
                device, "bgra8unorm", attachments,
                "test", 256, 256, true, false, idCounter
            );

            expect(result.msaa).toBe(true);
        });
    });
});
