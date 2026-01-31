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

vi.mock("./AttachmentManager/service/AttachmentManagerCreateRenderPassDescriptorService", () => ({
    "execute": vi.fn((attachment, r, g, b, a, loadOp) => ({
        "colorAttachments": [{
            "view": attachment.texture?.view,
            "clearValue": { r, g, b, a },
            "loadOp": loadOp,
            "storeOp": "store"
        }]
    }))
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

        it("should initialize with null current attachment", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            expect(manager.getCurrentAttachment()).toBeNull();
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

    describe("bindAttachment", () =>
    {
        it("should set current attachment", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            manager.bindAttachment(attachment);

            expect(manager.getCurrentAttachment()).toBe(attachment);
        });
    });

    describe("getCurrentAttachment", () =>
    {
        it("should return null before binding", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);

            expect(manager.getCurrentAttachment()).toBeNull();
        });

        it("should return bound attachment", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            manager.bindAttachment(attachment);

            expect(manager.getCurrentAttachment()).toBe(attachment);
        });
    });

    describe("currentAttachmentObject", () =>
    {
        it("should return same as getCurrentAttachment", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            manager.bindAttachment(attachment);

            expect(manager.currentAttachmentObject).toBe(manager.getCurrentAttachment());
        });
    });

    describe("unbindAttachment", () =>
    {
        it("should set current attachment to null", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            manager.bindAttachment(attachment);
            manager.unbindAttachment();

            expect(manager.getCurrentAttachment()).toBeNull();
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

    describe("createRenderPassDescriptor", () =>
    {
        it("should create descriptor with clear color", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            const descriptor = manager.createRenderPassDescriptor(
                attachment, 0.5, 0.5, 0.5, 1.0, "clear"
            );

            expect(descriptor.colorAttachments).toBeDefined();
            expect((descriptor.colorAttachments as any)[0].clearValue).toEqual({
                "r": 0.5, "g": 0.5, "b": 0.5, "a": 1.0
            });
        });

        it("should use clear as default loadOp", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            const descriptor = manager.createRenderPassDescriptor(
                attachment, 0, 0, 0, 0
            );

            expect((descriptor.colorAttachments as any)[0].loadOp).toBe("clear");
        });

        it("should accept load as loadOp", () =>
        {
            const device = createMockDevice();
            const manager = new AttachmentManager(device);
            const attachment = manager.getAttachmentObject(100, 100);

            const descriptor = manager.createRenderPassDescriptor(
                attachment, 0, 0, 0, 0, "load"
            );

            expect((descriptor.colorAttachments as any)[0].loadOp).toBe("load");
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
