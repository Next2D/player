import { Context } from "../../Context";
import { execute } from "./ContextUpdateBackgroundColorService";
import { describe, expect, it, vi } from "vitest";

describe("ContextUpdateBackgroundColorService.js method test", () =>
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
            "createBuffer": vi.fn(() => "createBuffer"),
            "createVertexArray": vi.fn(() => "createVertexArray"),
            "bindVertexArray": vi.fn(() => "bindVertexArray"),
            "bindBuffer": vi.fn(() => "bindBuffer"),
            "bufferData": vi.fn(() => "bufferData"),
            "enableVertexAttribArray": vi.fn(() => "enableVertexAttribArray"),
            "vertexAttribPointer": vi.fn(() => "vertexAttribPointer"),
            "vertexAttribDivisor": vi.fn(() => "vertexAttribDivisor"),
            "enable": vi.fn(() => "enable"),
            "blendFunc": vi.fn(() => "blendFunc"),
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);
        expect(context.$clearColorR).toBe(0);
        expect(context.$clearColorG).toBe(0);
        expect(context.$clearColorB).toBe(0);
        expect(context.$clearColorA).toBe(0);
        execute(context, 1, 1, 1, 1);
        expect(context.$clearColorR).toBe(1);
        expect(context.$clearColorG).toBe(1);
        expect(context.$clearColorB).toBe(1);
        expect(context.$clearColorA).toBe(1);
    });
});