import { Context } from "../../Context";
import { execute } from "./ContextTransformService";
import { describe, expect, it, vi } from "vitest";

describe("ContextTransformService.js method test", () =>
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
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);

        context.$matrix.fill(3);
        context.$matrix[6] = 100;
        context.$matrix[7] = 200;
        expect(context.$matrix[0]).toBe(3);
        expect(context.$matrix[1]).toBe(3);
        expect(context.$matrix[2]).toBe(3);
        expect(context.$matrix[3]).toBe(3);
        expect(context.$matrix[4]).toBe(3);
        expect(context.$matrix[5]).toBe(3);
        expect(context.$matrix[6]).toBe(100);
        expect(context.$matrix[7]).toBe(200);
        expect(context.$matrix[8]).toBe(3);
        
        execute(context, 9, 3, 5, 2, 50, 300);

        expect(context.$matrix[0]).toBe(36);
        expect(context.$matrix[1]).toBe(36);
        expect(context.$matrix[2]).toBe(3);
        expect(context.$matrix[3]).toBe(21);
        expect(context.$matrix[4]).toBe(21);
        expect(context.$matrix[5]).toBe(3);
        expect(context.$matrix[6]).toBe(1150);
        expect(context.$matrix[7]).toBe(1250);
        expect(context.$matrix[8]).toBe(3);
    });
});