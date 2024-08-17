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
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);
        expect(context.$mainAttachment).toBe(null);
        execute(context, 100, 200);

        if (!context.$mainAttachment)
        {
            throw new Error("context.$mainAttachment is null");
        }
        
        expect(context.$mainAttachment.width).toBe(100);
        expect(context.$mainAttachment.height).toBe(200);
        expect(context.$mainAttachment.clipLevel).toBe(0);
        expect(context.$mainAttachment.msaa).toBe(true);
        expect(context.$mainAttachment.mask).toBe(false);
        expect(context.$mainAttachment.texture).toBe(null);
        expect(context.$mainAttachment.color?.resource).toBe("createRenderbuffer");
        expect(context.$mainAttachment.color?.width).toBe(256);
        expect(context.$mainAttachment.color?.height).toBe(256);
        expect(context.$mainAttachment.stencil?.resource).toBe("createRenderbuffer");
        expect(context.$mainAttachment.stencil?.width).toBe(0);
        expect(context.$mainAttachment.stencil?.height).toBe(0);
    });
});