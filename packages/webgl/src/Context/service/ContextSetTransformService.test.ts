import { Context } from "../../Context";
import { execute } from "./ContextSetTransformService";
import { describe, expect, it, vi } from "vitest";

describe("ContextSetTransformService.js method test", () =>
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

        context.$matrix.fill(0);
        expect(context.$matrix[0]).toBe(0);
        expect(context.$matrix[1]).toBe(0);
        expect(context.$matrix[2]).toBe(0);
        expect(context.$matrix[3]).toBe(0);
        expect(context.$matrix[4]).toBe(0);
        expect(context.$matrix[5]).toBe(0);
        expect(context.$matrix[6]).toBe(0);
        expect(context.$matrix[7]).toBe(0);
        expect(context.$matrix[8]).toBe(0);
        
        execute(context, 1, 2, 3, 4, 5, 6);

        expect(context.$matrix[0]).toBe(1);
        expect(context.$matrix[1]).toBe(2);
        expect(context.$matrix[2]).toBe(0);
        expect(context.$matrix[3]).toBe(3);
        expect(context.$matrix[4]).toBe(4);
        expect(context.$matrix[5]).toBe(0);
        expect(context.$matrix[6]).toBe(5);
        expect(context.$matrix[7]).toBe(6);
        expect(context.$matrix[8]).toBe(0);
    });
});