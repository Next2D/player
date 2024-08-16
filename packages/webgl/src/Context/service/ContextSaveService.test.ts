import { Context } from "../../Context";
import { execute } from "./ContextSaveService";
import { describe, expect, it, vi } from "vitest";

describe("ContextSaveService.js method test", () =>
{
    it("test case", () =>
    {
        const mockGL = {
            "getParameter": vi.fn(() => "getParameter"),
            "clearColor": vi.fn(() => "clearColor"),
            "viewport": vi.fn(() => "viewport"),
            "pixelStorei": vi.fn(() => "pixelStorei"),
            "bindFramebuffer": vi.fn(() => "bindFramebuffer"),
            "createFramebuffer": vi.fn(() => "createFramebuffer"),
        } as unknown as WebGL2RenderingContext;

        const context = new Context(mockGL, 4);

        context.$stack.length = 0;
        expect(context.$stack.length).toBe(0);
        execute(context);
        expect(context.$stack.length).toBe(1);
    });
});