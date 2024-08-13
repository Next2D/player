import { execute } from "./ColorBufferObjectCreateService";
import { describe, expect, it, vi } from "vitest";

describe("ColorBufferObjectCreateService.js method test", () =>
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

        const colorBufferObject = execute();
        expect(colorBufferObject.colorRenderbuffer).toBe("createRenderbuffer");
        expect(colorBufferObject.stencilRenderbuffer).toBe("createRenderbuffer");
        expect(colorBufferObject.width).toBe(0);
        expect(colorBufferObject.height).toBe(0);
        expect(colorBufferObject.area).toBe(0);
    });
});