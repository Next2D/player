import { describe, it, expect, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./FrameBufferManagerReleaseTemporaryAttachmentUseCase";

describe("FrameBufferManagerReleaseTemporaryAttachmentUseCase", () =>
{
    let attachments: Map<string, IAttachmentObject>;
    let pendingReleases: IAttachmentObject[];

    const createMockAttachment = (id: number): IAttachmentObject => ({
        id,
        "width": 256,
        "height": 256,
        "texture": null,
        "stencil": null,
        "currentColorBuffer": null,
        "currentStencilBuffer": null,
        "msaaColorBuffer": null
    } as IAttachmentObject);

    beforeEach(() =>
    {
        attachments = new Map();
        pendingReleases = [];
    });

    it("should remove attachment from map by id", () =>
    {
        const attachment = createMockAttachment(1);
        attachments.set("temp_1", attachment);

        execute(attachments, pendingReleases, attachment);

        expect(attachments.has("temp_1")).toBe(false);
    });

    it("should add attachment to pending releases", () =>
    {
        const attachment = createMockAttachment(1);
        attachments.set("temp_1", attachment);

        execute(attachments, pendingReleases, attachment);

        expect(pendingReleases).toContain(attachment);
    });

    it("should handle attachment not found in map", () =>
    {
        const attachment = createMockAttachment(999);

        expect(() => execute(attachments, pendingReleases, attachment)).not.toThrow();
        expect(pendingReleases).toHaveLength(0);
    });

    it("should only remove matching attachment", () =>
    {
        const attachment1 = createMockAttachment(1);
        const attachment2 = createMockAttachment(2);
        attachments.set("temp_1", attachment1);
        attachments.set("temp_2", attachment2);

        execute(attachments, pendingReleases, attachment1);

        expect(attachments.has("temp_1")).toBe(false);
        expect(attachments.has("temp_2")).toBe(true);
    });

    it("should stop after finding first match", () =>
    {
        const attachment = createMockAttachment(1);
        attachments.set("first", attachment);
        attachments.set("second", attachment); // Same attachment, different key

        execute(attachments, pendingReleases, attachment);

        // Only one should be removed
        expect(attachments.size).toBe(1);
        expect(pendingReleases).toHaveLength(1);
    });

    it("should handle empty attachments map", () =>
    {
        const attachment = createMockAttachment(1);

        expect(() => execute(attachments, pendingReleases, attachment)).not.toThrow();
        expect(pendingReleases).toHaveLength(0);
    });

    it("should find attachment regardless of key name", () =>
    {
        const attachment = createMockAttachment(42);
        attachments.set("any_key_name", attachment);

        execute(attachments, pendingReleases, attachment);

        expect(attachments.size).toBe(0);
        expect(pendingReleases).toContain(attachment);
    });

    it("should preserve other pending releases", () =>
    {
        const existing = createMockAttachment(100);
        pendingReleases.push(existing);

        const attachment = createMockAttachment(1);
        attachments.set("temp", attachment);

        execute(attachments, pendingReleases, attachment);

        expect(pendingReleases).toHaveLength(2);
        expect(pendingReleases).toContain(existing);
        expect(pendingReleases).toContain(attachment);
    });
});
