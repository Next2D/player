import { execute } from "./ContextFillBackgroundColorService";
import { describe, expect, it, vi } from "vitest";

describe("ContextFillBackgroundColorService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => "createTexture"),
                    "activeTexture": vi.fn(() => "activeTexture"),
                    "bindTexture": vi.fn(() => "bindTexture"),
                    "texParameteri": vi.fn(() => "texParameteri"),
                    "texStorage2D": vi.fn(() => "texStorage2D"),
                    "getParameter": vi.fn(() => "getParameter"),
                    "pixelStorei": vi.fn(() => "pixelStorei"),
                    "createFramebuffer": vi.fn(() => "createFramebuffer"),
                    "clearColor": vi.fn(() => "clearColor"),
                    "createRenderbuffer": vi.fn(() => "createRenderbuffer"),
                    "bindRenderbuffer": vi.fn(() => "bindRenderbuffer"),
                    "renderbufferStorageMultisample": vi.fn(() => "renderbufferStorageMultisample"),
                    "viewport": vi.fn(() => "viewport"),
                    "renderbufferStorage": vi.fn(() => "renderbufferStorage"),
                    "bindFramebuffer": vi.fn(() => { return "bindFramebuffer" }),
                    "clearBufferfv": vi.fn((buffer, drawbuffer, values) =>
                    {
                        expect(values[0]).toBe(1);
                        expect(values[1]).toBe(2);
                        expect(values[2]).toBe(3);
                        expect(values[3]).toBe(4); 
                    }),
                }
            }
        });

        execute(1, 2, 3, 4);
    });
});