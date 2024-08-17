import { Context } from "../../Context";
import { execute } from "./ContextRestoreService";
import { describe, expect, it, vi } from "vitest";

describe("ContextRestoreService.js method test", () =>
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

        context.$stack.length = 0;
        context.$stack.push(new Float32Array([
            1, 0, 0,
            0, 1, 0,
            0, 0, 0
        ]))
        expect(context.$stack.length).toBe(1);
        execute(context);
        expect(context.$stack.length).toBe(0);
    });
});