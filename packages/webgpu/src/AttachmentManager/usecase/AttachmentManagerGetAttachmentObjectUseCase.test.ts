import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute } from "./AttachmentManagerGetAttachmentObjectUseCase";

// Mock the services
vi.mock("../service/AttachmentManagerCreateAttachmentObjectService", () => ({
    "execute": vi.fn((idCounter) => ({
        "id": idCounter.attachmentId++,
        "width": 0,
        "height": 0,
        "clipLevel": 0,
        "msaa": false,
        "mask": false,
        "color": null,
        "texture": null,
        "stencil": null,
        "msaaTexture": null,
        "msaaStencil": null
    }))
}));

vi.mock("../service/AttachmentManagerGetStencilBufferService", () => ({
    "execute": vi.fn(() => ({ "id": 1, "resource": {} } as IStencilBufferObject))
}));

vi.mock("../service/AttachmentManagerGetColorBufferService", () => ({
    "execute": vi.fn(() => ({ "id": 1, "view": {} } as IColorBufferObject))
}));

vi.mock("../service/AttachmentManagerGetTextureService", () => ({
    "execute": vi.fn(() => ({
        "id": 1,
        "width": 256,
        "height": 256,
        "smooth": true
    } as ITextureObject))
}));

import { execute as mockCreateAttachment } from "../service/AttachmentManagerCreateAttachmentObjectService";
import { execute as mockGetStencilBuffer } from "../service/AttachmentManagerGetStencilBufferService";
import { execute as mockGetColorBuffer } from "../service/AttachmentManagerGetColorBufferService";
import { execute as mockGetTexture } from "../service/AttachmentManagerGetTextureService";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    RENDER_ATTACHMENT: 0x10,
    TEXTURE_BINDING: 0x04,
    COPY_SRC: 0x01,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

describe("AttachmentManagerGetAttachmentObjectUseCase", () =>
{
    let attachmentPool: IAttachmentObject[];
    let texturePool: Map<string, ITextureObject[]>;
    let colorBufferPool: IColorBufferObject[];
    let stencilBufferPool: IStencilBufferObject[];
    let idCounter: { attachmentId: number; textureId: number; stencilId: number };

    const createMockDevice = () =>
    {
        return {} as GPUDevice;
    };

    beforeEach(() =>
    {
        attachmentPool = [];
        texturePool = new Map();
        colorBufferPool = [];
        stencilBufferPool = [];
        idCounter = { attachmentId: 1, textureId: 1, stencilId: 1 };
        vi.clearAllMocks();
    });

    describe("pool reuse", () =>
    {
        it("should reuse attachment from pool when available", () =>
        {
            const device = createMockDevice();
            const existingAttachment: IAttachmentObject = {
                "id": 99,
                "width": 100,
                "height": 100,
                "clipLevel": 5,
                "msaa": true,
                "mask": true,
                "color": null,
                "texture": null,
                "stencil": null,
                "msaaTexture": null,
                "msaaStencil": null
            };
            attachmentPool.push(existingAttachment);

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(result.id).toBe(99);
            expect(mockCreateAttachment).not.toHaveBeenCalled();
        });

        it("should create new attachment when pool is empty", () =>
        {
            const device = createMockDevice();

            execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(mockCreateAttachment).toHaveBeenCalledWith(idCounter);
        });

        it("should remove attachment from pool when reusing", () =>
        {
            const device = createMockDevice();
            const existingAttachment: IAttachmentObject = {
                "id": 1,
                "width": 0,
                "height": 0,
                "clipLevel": 0,
                "msaa": false,
                "mask": false,
                "color": null,
                "texture": null,
                "stencil": null,
                "msaaTexture": null,
                "msaaStencil": null
            };
            attachmentPool.push(existingAttachment);
            expect(attachmentPool.length).toBe(1);

            execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(attachmentPool.length).toBe(0);
        });
    });

    describe("property updates", () =>
    {
        it("should update width", () =>
        {
            const device = createMockDevice();

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 512, 256, false, idCounter
            );

            expect(result.width).toBe(512);
        });

        it("should update height", () =>
        {
            const device = createMockDevice();

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 512, false, idCounter
            );

            expect(result.height).toBe(512);
        });

        it("should update msaa flag to true", () =>
        {
            const device = createMockDevice();

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, true, idCounter
            );

            expect(result.msaa).toBe(true);
        });

        it("should update msaa flag to false", () =>
        {
            const device = createMockDevice();

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(result.msaa).toBe(false);
        });

        it("should reset mask to false", () =>
        {
            const device = createMockDevice();
            const existingAttachment: IAttachmentObject = {
                "id": 1,
                "width": 0,
                "height": 0,
                "clipLevel": 0,
                "msaa": false,
                "mask": true, // previously had mask
                "color": null,
                "texture": null,
                "stencil": null,
                "msaaTexture": null,
                "msaaStencil": null
            };
            attachmentPool.push(existingAttachment);

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(result.mask).toBe(false);
        });

        it("should reset clipLevel to 0", () =>
        {
            const device = createMockDevice();
            const existingAttachment: IAttachmentObject = {
                "id": 1,
                "width": 0,
                "height": 0,
                "clipLevel": 5, // previously had clipLevel
                "msaa": false,
                "mask": false,
                "color": null,
                "texture": null,
                "stencil": null,
                "msaaTexture": null,
                "msaaStencil": null
            };
            attachmentPool.push(existingAttachment);

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(result.clipLevel).toBe(0);
        });
    });

    describe("resource acquisition", () =>
    {
        it("should acquire stencil buffer", () =>
        {
            const device = createMockDevice();

            execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(mockGetStencilBuffer).toHaveBeenCalledWith(
                device, stencilBufferPool, 256, 256, idCounter
            );
        });

        it("should acquire color buffer with stencil reference", () =>
        {
            const device = createMockDevice();

            execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(mockGetColorBuffer).toHaveBeenCalledWith(
                device, colorBufferPool, 256, 256, expect.any(Object)
            );
        });

        it("should acquire texture", () =>
        {
            const device = createMockDevice();

            execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(mockGetTexture).toHaveBeenCalledWith(
                device, texturePool, 256, 256, true, idCounter
            );
        });

        it("should assign acquired resources to attachment", () =>
        {
            const device = createMockDevice();

            const result = execute(
                device, attachmentPool, texturePool, colorBufferPool,
                stencilBufferPool, 256, 256, false, idCounter
            );

            expect(result.color).not.toBeNull();
            expect(result.stencil).not.toBeNull();
            expect(result.texture).not.toBeNull();
        });
    });
});
