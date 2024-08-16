import { Context } from "../../Context";
import { execute } from "./ContextTransformService";
import { describe, expect, it, vi } from "vitest";

describe("ContextTransformService.js method test", () =>
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