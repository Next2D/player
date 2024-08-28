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
                    "createRenderbuffer": vi.fn(() => "createRenderbuffer"),
                    "bindRenderbuffer": vi.fn(() => "bindRenderbuffer"),
                    "renderbufferStorageMultisample": vi.fn(() => "renderbufferStorageMultisample"),
                    "viewport": vi.fn(() => "viewport"),
                    "renderbufferStorage": vi.fn(() => "renderbufferStorage"),
                    "bindFramebuffer": vi.fn(() => { return "bindFramebuffer" }),
                    "clear": vi.fn(() => { return "clear" }),
                    "clearColor": vi.fn((red, green, blue, alpha) =>
                    {
                        if (red === 1) {
                            expect(red).toBe(1);
                            expect(green).toBe(2);
                            expect(blue).toBe(3);
                            expect(alpha).toBe(4);
                        } else {
                            expect(red).toBe(0);
                            expect(green).toBe(0);
                            expect(blue).toBe(0);
                            expect(alpha).toBe(0);
                        }
                    }),
                }
            }
        });

        execute(1, 2, 3, 4);
    });
});