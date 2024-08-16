import { Context } from "../../Context";
import { execute } from "./ContextSetTransformService";
import { describe, expect, it, vi } from "vitest";

describe("ContextSetTransformService.js method test", () =>
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