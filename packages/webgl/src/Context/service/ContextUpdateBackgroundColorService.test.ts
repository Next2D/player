import { Context } from "../../Context";
import { execute } from "./ContextUpdateBackgroundColorService";
import { describe, expect, it, vi } from "vitest";

describe("ContextUpdateBackgroundColorService.js method test", () =>
{
    it("test case", async () =>
    {
        const mockGL = {
            "getParameter": vi.fn(),
            "pixelStorei": vi.fn(),
            "createFramebuffer": vi.fn(),
            "bindFramebuffer": vi.fn(),
            "clearColor": vi.fn(),
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