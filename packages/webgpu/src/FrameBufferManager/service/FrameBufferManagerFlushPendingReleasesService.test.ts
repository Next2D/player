import { describe, it, expect, vi } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerFlushPendingReleasesService";

describe("FrameBufferManagerFlushPendingReleasesService", () =>
{
    const createMockAttachment = (hasTexture: boolean, hasStencil: boolean): IAttachmentObject =>
    {
        return {
            "texture": hasTexture ? {
                "resource": { "destroy": vi.fn() }
            } : null,
            "stencil": hasStencil ? {
                "resource": { "destroy": vi.fn() }
            } : null
        } as unknown as IAttachmentObject;
    };

    it("should destroy texture resources", () =>
    {
        const attachment = createMockAttachment(true, false);
        const pendingReleases = [attachment];

        execute(pendingReleases);

        expect(attachment.texture!.resource.destroy).toHaveBeenCalled();
    });

    it("should destroy stencil resources", () =>
    {
        const attachment = createMockAttachment(false, true);
        const pendingReleases = [attachment];

        execute(pendingReleases);

        expect(attachment.stencil!.resource.destroy).toHaveBeenCalled();
    });

    it("should destroy both texture and stencil resources", () =>
    {
        const attachment = createMockAttachment(true, true);
        const pendingReleases = [attachment];

        execute(pendingReleases);

        expect(attachment.texture!.resource.destroy).toHaveBeenCalled();
        expect(attachment.stencil!.resource.destroy).toHaveBeenCalled();
    });

    it("should handle attachment without texture", () =>
    {
        const attachment = createMockAttachment(false, true);
        const pendingReleases = [attachment];

        expect(() => execute(pendingReleases)).not.toThrow();
    });

    it("should handle attachment without stencil", () =>
    {
        const attachment = createMockAttachment(true, false);
        const pendingReleases = [attachment];

        expect(() => execute(pendingReleases)).not.toThrow();
    });

    it("should handle empty pending releases array", () =>
    {
        const pendingReleases: IAttachmentObject[] = [];

        expect(() => execute(pendingReleases)).not.toThrow();
    });

    it("should process multiple attachments", () =>
    {
        const attachment1 = createMockAttachment(true, true);
        const attachment2 = createMockAttachment(true, false);
        const attachment3 = createMockAttachment(false, true);
        const pendingReleases = [attachment1, attachment2, attachment3];

        execute(pendingReleases);

        expect(attachment1.texture!.resource.destroy).toHaveBeenCalled();
        expect(attachment1.stencil!.resource.destroy).toHaveBeenCalled();
        expect(attachment2.texture!.resource.destroy).toHaveBeenCalled();
        expect(attachment3.stencil!.resource.destroy).toHaveBeenCalled();
    });

    it("should call destroy exactly once per resource", () =>
    {
        const attachment = createMockAttachment(true, true);
        const pendingReleases = [attachment];

        execute(pendingReleases);

        expect(attachment.texture!.resource.destroy).toHaveBeenCalledTimes(1);
        expect(attachment.stencil!.resource.destroy).toHaveBeenCalledTimes(1);
    });
});
