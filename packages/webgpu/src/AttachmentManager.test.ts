import { describe, it, expect, vi, beforeEach } from "vitest";
import { AttachmentManager } from "./AttachmentManager";
import type { IAttachmentObject } from "./interface/IAttachmentObject";

// Mock usecase and service modules
vi.mock("./AttachmentManager/usecase/AttachmentManagerGetAttachmentObjectUseCase", () => ({
    "execute": vi.fn((device, attachmentPool, texturePool, colorBufferPool, stencilBufferPool, width, height, msaa, idCounter) => {
        idCounter.attachmentId++;
        return {
            "id": idCounter.attachmentId,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": msaa,
            "mask": false,
            "color": null,
            "texture": {
                "resource": { "destroy": vi.fn() },
                "view": {}
            },
            "stencil": null
        } as unknown as IAttachmentObject;
    })
}));

vi.mock("./AttachmentManager/usecase/AttachmentManagerReleaseAttachmentUseCase", () => ({
    "execute": vi.fn()
}));


describe("AttachmentManager", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createTexture": vi.fn(() => ({
                "createView": vi.fn(),
                "destroy": vi.fn()
            }))
        } as unknown as GPUDevice;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("constructor", () =>
    {
        it("should create instance with device", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            expect(manager).toBeDefined();
        });

    });

    describe("getAttachmentObject", () =>
    {
        it("should return attachment with specified dimensions", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            const attachment = manager.getAttachmentObject(200, 150);

            expect(attachment.width).toBe(200);
            expect(attachment.height).toBe(150);
        });

        it("should return attachment without msaa by default", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            const attachment = manager.getAttachmentObject(100, 100);

            expect(attachment.msaa).toBe(false);
        });

        it("should return attachment with msaa when specified", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            const attachment = manager.getAttachmentObject(100, 100, true);

            expect(attachment.msaa).toBe(true);
        });

        it("should increment attachment id for each call", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            const attachment1 = manager.getAttachmentObject(100, 100);
            const attachment2 = manager.getAttachmentObject(100, 100);

            expect(attachment2.id).toBeGreaterThan(attachment1.id);
        });
    });

    describe("releaseAttachment", () =>
    {
        it("should release attachment back to pool", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            expect(() => manager.releaseAttachment(attachment)).not.toThrow();
        });
    });

    describe("dispose", () =>
    {
        it("should not throw when disposing empty manager", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            expect(() => manager.dispose()).not.toThrow();
        });

        it("should clear all pools after disposal", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            manager.getAttachmentObject(100, 100);
            manager.dispose();

            // After dispose, getting new attachment should work (fresh state)
            expect(() => manager.getAttachmentObject(100, 100)).not.toThrow();
        });
    });
});
