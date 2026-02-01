import { describe, it, expect, vi, beforeEach } from "vitest";
import { FrameBufferManager } from "./FrameBufferManager";
import type { IAttachmentObject } from "./interface/IAttachmentObject";

// Mock usecase and service modules
vi.mock("./FrameBufferManager/usecase/FrameBufferManagerCreateAttachmentUseCase", () => ({
    "execute": vi.fn((device, format, attachments, name, width, height, msaa, mask, idCounter) => {
        idCounter.nextId++;
        idCounter.textureId++;
        const attachment: IAttachmentObject = {
            "id": idCounter.nextId,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": msaa,
            "mask": mask,
            "color": null,
            "texture": {
                "id": idCounter.textureId,
                "width": width,
                "height": height,
                "area": width * height,
                "smooth": true,
                "resource": { "destroy": vi.fn() },
                "view": {}
            },
            "stencil": mask ? {
                "id": idCounter.stencilId++,
                "resource": { "destroy": vi.fn() },
                "view": {}
            } : null,
            "msaaTexture": null,
            "msaaStencil": null
        };
        attachments.set(name, attachment);
        return attachment;
    })
}));

vi.mock("./FrameBufferManager/usecase/FrameBufferManagerReleaseTemporaryAttachmentUseCase", () => ({
    "execute": vi.fn((attachments, pendingReleases, attachment) => {
        // Find and remove from attachments
        for (const [key, value] of attachments.entries()) {
            if (value === attachment) {
                attachments.delete(key);
                pendingReleases.push(attachment);
                break;
            }
        }
    })
}));

vi.mock("./FrameBufferManager/service/FrameBufferManagerCreateRenderPassDescriptorService", () => ({
    "execute": vi.fn((view, r, g, b, a, loadOp, resolveTarget) => ({
        "colorAttachments": [{
            "view": view,
            "resolveTarget": resolveTarget,
            "clearValue": { r, g, b, a },
            "loadOp": loadOp,
            "storeOp": "store"
        }]
    }))
}));

vi.mock("./FrameBufferManager/service/FrameBufferManagerCreateStencilRenderPassDescriptorService", () => ({
    "execute": vi.fn((colorView, stencilView, colorLoadOp, stencilLoadOp, resolveTarget) => ({
        "colorAttachments": [{
            "view": colorView,
            "resolveTarget": resolveTarget,
            "loadOp": colorLoadOp,
            "storeOp": "store"
        }],
        "depthStencilAttachment": {
            "view": stencilView,
            "stencilLoadOp": stencilLoadOp,
            "stencilStoreOp": "store"
        }
    }))
}));

vi.mock("./FrameBufferManager/service/FrameBufferManagerFlushPendingReleasesService", () => ({
    "execute": vi.fn((pendingReleases) => {
        for (const attachment of pendingReleases) {
            if (attachment.texture) {
                attachment.texture.resource.destroy();
            }
            if (attachment.stencil) {
                attachment.stencil.resource.destroy();
            }
        }
    })
}));

describe("FrameBufferManager", () =>
{
    const createMockDevice = (): GPUDevice =>
    {
        return {
            "createTexture": vi.fn(() => ({
                "createView": vi.fn(() => ({})),
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
        it("should create instance with device and format", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            expect(manager).toBeDefined();
        });

        it("should initialize with null current attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            expect(manager.getCurrentAttachment()).toBeNull();
        });

        it("should not create atlas attachment on initialization (managed by AtlasManager)", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            // アトラスはAtlasManagerが動的に管理するため、初期化時には作成されない
            const atlas = manager.getAttachment("atlas");
            expect(atlas).toBeUndefined();
        });
    });

    describe("createAttachment", () =>
    {
        it("should create attachment with specified dimensions", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            const attachment = manager.createAttachment("test", 512, 256);

            expect(attachment.width).toBe(512);
            expect(attachment.height).toBe(256);
        });

        it("should create attachment without msaa by default", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            const attachment = manager.createAttachment("test", 100, 100);

            expect(attachment.msaa).toBe(false);
        });

        it("should create attachment with msaa when specified", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            const attachment = manager.createAttachment("test", 100, 100, true);

            expect(attachment.msaa).toBe(true);
        });

        it("should create attachment with mask when specified", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            const attachment = manager.createAttachment("test", 100, 100, false, true);

            expect(attachment.mask).toBe(true);
            expect(attachment.stencil).toBeDefined();
        });

        it("should store attachment by name", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            manager.createAttachment("myAttachment", 200, 200);
            const retrieved = manager.getAttachment("myAttachment");

            expect(retrieved).toBeDefined();
        });
    });

    describe("getAttachment", () =>
    {
        it("should return undefined for non-existent attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            expect(manager.getAttachment("nonexistent")).toBeUndefined();
        });
    });

    describe("setCurrentAttachment", () =>
    {
        it("should set current attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createAttachment("test", 100, 100);

            manager.setCurrentAttachment(attachment);

            expect(manager.getCurrentAttachment()).toBe(attachment);
        });

        it("should allow setting to null", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createAttachment("test", 100, 100);

            manager.setCurrentAttachment(attachment);
            manager.setCurrentAttachment(null);

            expect(manager.getCurrentAttachment()).toBeNull();
        });
    });

    describe("createRenderPassDescriptor", () =>
    {
        it("should create descriptor with clear color", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const mockView = {} as GPUTextureView;

            const descriptor = manager.createRenderPassDescriptor(
                mockView, 0.5, 0.5, 0.5, 1.0, "clear"
            );

            expect(descriptor.colorAttachments).toBeDefined();
            expect((descriptor.colorAttachments as any)[0].clearValue).toEqual({
                "r": 0.5, "g": 0.5, "b": 0.5, "a": 1.0
            });
        });

        it("should use clear as default loadOp", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const mockView = {} as GPUTextureView;

            const descriptor = manager.createRenderPassDescriptor(mockView, 0, 0, 0, 0);

            expect((descriptor.colorAttachments as any)[0].loadOp).toBe("clear");
        });

        it("should accept resolveTarget for MSAA", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const mockView = {} as GPUTextureView;
            const resolveTarget = {} as GPUTextureView;

            const descriptor = manager.createRenderPassDescriptor(
                mockView, 0, 0, 0, 0, "clear", resolveTarget
            );

            expect((descriptor.colorAttachments as any)[0].resolveTarget).toBe(resolveTarget);
        });
    });

    describe("createStencilRenderPassDescriptor", () =>
    {
        it("should create descriptor with stencil attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const colorView = {} as GPUTextureView;
            const stencilView = {} as GPUTextureView;

            const descriptor = manager.createStencilRenderPassDescriptor(
                colorView, stencilView, "load", "clear"
            );

            expect(descriptor.depthStencilAttachment).toBeDefined();
            expect((descriptor.depthStencilAttachment as any).stencilLoadOp).toBe("clear");
        });

        it("should use load as default color loadOp", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const colorView = {} as GPUTextureView;
            const stencilView = {} as GPUTextureView;

            const descriptor = manager.createStencilRenderPassDescriptor(colorView, stencilView);

            expect((descriptor.colorAttachments as any)[0].loadOp).toBe("load");
        });
    });

    describe("destroyAttachment", () =>
    {
        it("should destroy attachment and remove from map", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createAttachment("test", 100, 100);

            manager.destroyAttachment("test");

            expect(attachment.texture!.resource.destroy).toHaveBeenCalled();
            expect(manager.getAttachment("test")).toBeUndefined();
        });

        it("should not throw when attachment does not exist", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            expect(() => manager.destroyAttachment("nonexistent")).not.toThrow();
        });
    });

    describe("resizeAttachment", () =>
    {
        it("should destroy old and create new attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const oldAttachment = manager.createAttachment("test", 100, 100);

            const newAttachment = manager.resizeAttachment("test", 200, 200);

            expect(oldAttachment.texture!.resource.destroy).toHaveBeenCalled();
            expect(newAttachment.width).toBe(200);
            expect(newAttachment.height).toBe(200);
        });
    });

    describe("createTemporaryAttachment", () =>
    {
        it("should create temporary attachment", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");

            const attachment = manager.createTemporaryAttachment(256, 256);

            expect(attachment).toBeDefined();
            expect(attachment.width).toBe(256);
            expect(attachment.height).toBe(256);
        });
    });

    describe("releaseTemporaryAttachment", () =>
    {
        it("should add attachment to pending releases", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createTemporaryAttachment(100, 100);

            manager.releaseTemporaryAttachment(attachment);

            // Should not throw
            expect(() => manager.flushPendingReleases()).not.toThrow();
        });
    });

    describe("flushPendingReleases", () =>
    {
        it("should destroy pending attachments", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createTemporaryAttachment(100, 100);

            manager.releaseTemporaryAttachment(attachment);
            manager.flushPendingReleases();

            expect(attachment.texture!.resource.destroy).toHaveBeenCalled();
        });

        it("should clear pending releases after flush", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createTemporaryAttachment(100, 100);

            manager.releaseTemporaryAttachment(attachment);
            manager.flushPendingReleases();

            // Second flush should not throw or re-destroy
            expect(() => manager.flushPendingReleases()).not.toThrow();
        });
    });

    describe("dispose", () =>
    {
        it("should destroy all attachments", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment1 = manager.createAttachment("test1", 100, 100);
            const attachment2 = manager.createAttachment("test2", 200, 200);

            manager.dispose();

            expect(attachment1.texture!.resource.destroy).toHaveBeenCalled();
            expect(attachment2.texture!.resource.destroy).toHaveBeenCalled();
        });

        it("should clear attachment map", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            manager.createAttachment("test", 100, 100);

            manager.dispose();

            expect(manager.getAttachment("test")).toBeUndefined();
        });

        it("should set current attachment to null", () =>
        {
            const device = createMockDevice();
            const manager = new FrameBufferManager(device, "bgra8unorm");
            const attachment = manager.createAttachment("test", 100, 100);
            manager.setCurrentAttachment(attachment);

            manager.dispose();

            expect(manager.getCurrentAttachment()).toBeNull();
        });
    });
});
