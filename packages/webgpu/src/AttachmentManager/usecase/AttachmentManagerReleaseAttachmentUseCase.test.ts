import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { ITextureObject } from "../../interface/ITextureObject";
import type { IColorBufferObject } from "../../interface/IColorBufferObject";
import type { IStencilBufferObject } from "../../interface/IStencilBufferObject";
import { execute } from "./AttachmentManagerReleaseAttachmentUseCase";

// Mock the service
vi.mock("../service/AttachmentManagerReleaseTextureService", () => ({
    "execute": vi.fn()
}));

import { execute as mockReleaseTexture } from "../service/AttachmentManagerReleaseTextureService";

describe("AttachmentManagerReleaseAttachmentUseCase", () =>
{
    let attachmentPool: IAttachmentObject[];
    let texturePool: Map<string, ITextureObject[]>;
    let colorBufferPool: IColorBufferObject[];
    let stencilBufferPool: IStencilBufferObject[];

    const createMockAttachment = (
        hasTexture: boolean = false,
        hasColor: boolean = false,
        hasStencil: boolean = false
    ): IAttachmentObject => ({
        "id": 1,
        "width": 256,
        "height": 256,
        "texture": hasTexture ? { "id": 1, "width": 256, "height": 256, "smooth": true } as ITextureObject : null,
        "color": hasColor ? { "id": 1 } as IColorBufferObject : null,
        "stencil": hasStencil ? { "id": 1 } as IStencilBufferObject : null
    } as IAttachmentObject);

    beforeEach(() =>
    {
        attachmentPool = [];
        texturePool = new Map();
        colorBufferPool = [];
        stencilBufferPool = [];
        vi.clearAllMocks();
    });

    it("should add attachment to pool", () =>
    {
        const attachment = createMockAttachment();

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(attachmentPool).toContain(attachment);
    });

    it("should release texture to texture pool", () =>
    {
        const attachment = createMockAttachment(true, false, false);
        const texture = attachment.texture;

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(mockReleaseTexture).toHaveBeenCalledWith(texturePool, texture);
    });

    it("should set texture to null after release", () =>
    {
        const attachment = createMockAttachment(true, false, false);

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(attachment.texture).toBeNull();
    });

    it("should release color buffer to pool", () =>
    {
        const attachment = createMockAttachment(false, true, false);
        const colorBuffer = attachment.color;

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(colorBufferPool).toContain(colorBuffer);
    });

    it("should set color to null after release", () =>
    {
        const attachment = createMockAttachment(false, true, false);

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(attachment.color).toBeNull();
    });

    it("should release stencil buffer to pool", () =>
    {
        const attachment = createMockAttachment(false, false, true);
        const stencilBuffer = attachment.stencil;

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(stencilBufferPool).toContain(stencilBuffer);
    });

    it("should set stencil to null after release", () =>
    {
        const attachment = createMockAttachment(false, false, true);

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(attachment.stencil).toBeNull();
    });

    it("should release all resources when all present", () =>
    {
        const attachment = createMockAttachment(true, true, true);

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(mockReleaseTexture).toHaveBeenCalled();
        expect(colorBufferPool.length).toBe(1);
        expect(stencilBufferPool.length).toBe(1);
        expect(attachment.texture).toBeNull();
        expect(attachment.color).toBeNull();
        expect(attachment.stencil).toBeNull();
    });

    it("should handle attachment with no resources", () =>
    {
        const attachment = createMockAttachment(false, false, false);

        expect(() =>
            execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment)
        ).not.toThrow();

        expect(attachmentPool).toContain(attachment);
    });

    it("should not call releaseTexture when no texture", () =>
    {
        const attachment = createMockAttachment(false, true, true);

        execute(attachmentPool, texturePool, colorBufferPool, stencilBufferPool, attachment);

        expect(mockReleaseTexture).not.toHaveBeenCalled();
    });
});
