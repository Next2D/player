import { execute } from "./StencilBufferObjectCreateService";
import { describe, expect, it, vi } from "vitest";

describe("StencilBufferObjectCreateService.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createRenderbuffer": vi.fn(() => { return  "createRenderbuffer" })
                }
            }
        });

        const stencilBufferObject = execute();
        expect(stencilBufferObject.resource).toBe("createRenderbuffer");
        expect(stencilBufferObject.width).toBe(0);
        expect(stencilBufferObject.height).toBe(0);
        expect(stencilBufferObject.area).toBe(0);
        expect(stencilBufferObject.dirty).toBe(false);
    });
});