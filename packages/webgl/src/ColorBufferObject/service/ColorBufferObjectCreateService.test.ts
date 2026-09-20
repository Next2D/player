import { execute } from "./ColorBufferObjectCreateService";
import { describe, expect, it, vi } from "vitest";

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


describe("ColorBufferObjectCreateService.js method test", () =>
{
    it("test case", () =>
    {


        const colorBufferObject = execute();
        expect(colorBufferObject.resource).toBe("createRenderbuffer");
        expect(colorBufferObject.stencil.resource).toBe("createRenderbuffer");
        expect(colorBufferObject.width).toBe(0);
        expect(colorBufferObject.height).toBe(0);
        expect(colorBufferObject.area).toBe(0);
        expect(colorBufferObject.dirty).toBe(false);
    });
});