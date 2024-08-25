import { Context } from "../../Context";
import { execute } from "./ContextResizeUseCase";
import { describe, expect, it, vi } from "vitest";

describe("ContextResizeUseCase.js method test", () =>
{
    it("test case", () =>
    {
        const mockGL = {
            "createTexture": vi.fn(() => "createTexture"),
            "activeTexture": vi.fn(() => "activeTexture"),
            "bindTexture": vi.fn(() => "bindTexture"),
            "texParameteri": vi.fn(() => "texParameteri"),
            "texStorage2D": vi.fn(() => "texStorage2D"),
            "getParameter": vi.fn(() => "getParameter"),
            "pixelStorei": vi.fn(() => "pixelStorei"),
            "createFramebuffer": vi.fn(() => "createFramebuffer"),
            "bindFramebuffer": vi.fn(() => "bindFramebuffer"),
            "clearColor": vi.fn(() => "clearColor"),
            "createRenderbuffer": vi.fn(() => "createRenderbuffer"),
            "bindRenderbuffer": vi.fn(() => "bindRenderbuffer"),
            "renderbufferStorageMultisample": vi.fn(() => "renderbufferStorageMultisample"),
            "framebufferRenderbuffer": vi.fn(() => "framebufferRenderbuffer"),
            "viewport": vi.fn(() => "viewport"),
            "renderbufferStorage": vi.fn(() => "renderbufferStorage"),
            "bindBuffer": vi.fn(() => "bindBuffer"),
            "createBuffer": vi.fn(() => "createBuffer"),
            "createVertexArray": vi.fn(() => "createVertexArray"),
            "bindVertexArray": vi.fn(() => "bindVertexArray"),
            "bufferData": vi.fn(() => "bufferData"),
            "enableVertexAttribArray": vi.fn(() => "enableVertexAttribArray"),
            "vertexAttribPointer": vi.fn(() => "vertexAttribPointer"),
            "vertexAttribDivisor": vi.fn(() => "vertexAttribDivisor"),
            "enable": vi.fn(() => "enable"),
            "blendFunc": vi.fn(() => "blendFunc"),
            "framebufferTexture2D": vi.fn(() => "framebufferTexture2D"),
            "scissor": vi.fn(() => "scissor"),
            "clear": vi.fn(() => "clear"),
            "disable": vi.fn(() => "disable"),
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);
        expect(context.$mainAttachmentObject).toBe(null);
        execute(context, 100, 200);

        if (!context.$mainAttachmentObject)
        {
            throw new Error("context.$mainAttachment is null");
        }
        
        expect(context.$mainAttachmentObject.width).toBe(100);
        expect(context.$mainAttachmentObject.height).toBe(200);
        expect(context.$mainAttachmentObject.clipLevel).toBe(0);
        expect(context.$mainAttachmentObject.msaa).toBe(true);
        expect(context.$mainAttachmentObject.mask).toBe(false);
        expect(context.$mainAttachmentObject.texture).toBe(null);
        expect(context.$mainAttachmentObject.color?.resource).toBe("createRenderbuffer");
        expect(context.$mainAttachmentObject.color?.width).toBe(256);
        expect(context.$mainAttachmentObject.color?.height).toBe(256);
        expect(context.$mainAttachmentObject.stencil?.resource).toBe("createRenderbuffer");
        expect(context.$mainAttachmentObject.stencil?.width).toBe(0);
        expect(context.$mainAttachmentObject.stencil?.height).toBe(0);
    });
});