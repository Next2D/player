import { describe, it, expect } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./AttachmentManagerCreateRenderPassDescriptorService";

describe("AttachmentManagerCreateRenderPassDescriptorService", () =>
{
    const createMockAttachment = (
        hasColorView: boolean = true,
        hasTextureView: boolean = false,
        hasStencil: boolean = false
    ): IAttachmentObject => ({
        "id": 1,
        "width": 256,
        "height": 256,
        "color": hasColorView ? { "view": { "label": "colorView" } } : null,
        "texture": hasTextureView ? { "view": { "label": "textureView" } } : null,
        "stencil": hasStencil ? { "view": { "label": "stencilView" } } : null
    } as unknown as IAttachmentObject);

    describe("color attachments", () =>
    {
        it("should use color.view when available", () =>
        {
            const attachment = createMockAttachment(true, false, false);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.colorAttachments[0].view).toEqual({ "label": "colorView" });
        });

        it("should fallback to texture.view when color.view is not available", () =>
        {
            const attachment = createMockAttachment(false, true, false);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.colorAttachments[0].view).toEqual({ "label": "textureView" });
        });

        it("should throw error when no color view available", () =>
        {
            const attachment = createMockAttachment(false, false, false);

            expect(() => execute(attachment, 0, 0, 0, 1, "clear")).toThrow(
                "No color view available for render pass"
            );
        });

        it("should set clearValue with provided RGBA values", () =>
        {
            const attachment = createMockAttachment(true);

            const result = execute(attachment, 0.5, 0.6, 0.7, 0.8, "clear");

            expect(result.colorAttachments[0].clearValue).toEqual({
                "r": 0.5,
                "g": 0.6,
                "b": 0.7,
                "a": 0.8
            });
        });

        it("should set loadOp to provided value", () =>
        {
            const attachment = createMockAttachment(true);

            const result = execute(attachment, 0, 0, 0, 1, "load");

            expect(result.colorAttachments[0].loadOp).toBe("load");
        });

        it("should default loadOp to clear", () =>
        {
            const attachment = createMockAttachment(true);

            const result = execute(attachment, 0, 0, 0, 1);

            expect(result.colorAttachments[0].loadOp).toBe("clear");
        });

        it("should set storeOp to store", () =>
        {
            const attachment = createMockAttachment(true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.colorAttachments[0].storeOp).toBe("store");
        });
    });

    describe("depth stencil attachment", () =>
    {
        it("should include depthStencilAttachment when stencil is available", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment).toBeDefined();
        });

        it("should not include depthStencilAttachment when stencil is not available", () =>
        {
            const attachment = createMockAttachment(true, false, false);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment).toBeUndefined();
        });

        it("should set stencil view correctly", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.view).toEqual({ "label": "stencilView" });
        });

        it("should set depth clear value to 1.0", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.depthClearValue).toBe(1.0);
        });

        it("should set stencil clear value to 0", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.stencilClearValue).toBe(0);
        });

        it("should set depthLoadOp to clear", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.depthLoadOp).toBe("clear");
        });

        it("should set depthStoreOp to store", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.depthStoreOp).toBe("store");
        });

        it("should set stencilLoadOp to clear", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.stencilLoadOp).toBe("clear");
        });

        it("should set stencilStoreOp to store", () =>
        {
            const attachment = createMockAttachment(true, false, true);

            const result = execute(attachment, 0, 0, 0, 1, "clear");

            expect(result.depthStencilAttachment?.stencilStoreOp).toBe("store");
        });
    });
});
