import { Context } from "../../Context";
import { execute } from "./ContextResetService";
import { describe, expect, it, vi } from "vitest";

describe("ContextResetService.js method test", () =>
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
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);

        context.globalAlpha = 0.5;
        context.globalCompositeOperation = "multiply";
        context.imageSmoothingEnabled = true;

        expect(context.globalAlpha).toBe(0.5);
        expect(context.globalCompositeOperation).toBe("multiply");
        expect(context.imageSmoothingEnabled).toBe(true);

        execute(context);
        
        expect(context.globalAlpha).toBe(1);
        expect(context.globalCompositeOperation).toBe("normal");
        expect(context.imageSmoothingEnabled).toBe(false);
    });
});