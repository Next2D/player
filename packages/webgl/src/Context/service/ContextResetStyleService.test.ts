import { Context } from "../../Context";
import { execute } from "./ContextResetStyleService";
import { describe, expect, it, vi } from "vitest";

describe("ContextResetStyleService.js method test", () =>
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
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);

        context.$fillType = 0;
        context.$fillStyle.fill(0.5);

        context.$strokeType = 0;
        context.$strokeStyle.fill(0.5);

        expect(context.$fillType).toBe(0);
        expect(context.$fillStyle[0]).toBe(0.5);
        expect(context.$fillStyle[1]).toBe(0.5);
        expect(context.$fillStyle[2]).toBe(0.5);
        expect(context.$fillStyle[3]).toBe(0.5);
        expect(context.$strokeType).toBe(0);
        expect(context.$strokeStyle[0]).toBe(0.5);
        expect(context.$strokeStyle[1]).toBe(0.5);
        expect(context.$strokeStyle[2]).toBe(0.5);
        expect(context.$strokeStyle[3]).toBe(0.5);

        execute(context);
        
        expect(context.$fillType).toBe(-1);
        expect(context.$fillStyle[0]).toBe(1);
        expect(context.$fillStyle[1]).toBe(1);
        expect(context.$fillStyle[2]).toBe(1);
        expect(context.$fillStyle[3]).toBe(1);
        expect(context.$strokeType).toBe(-1);
        expect(context.$strokeStyle[0]).toBe(1);
        expect(context.$strokeStyle[1]).toBe(1);
        expect(context.$strokeStyle[2]).toBe(1);
        expect(context.$strokeStyle[3]).toBe(1);
    });
});