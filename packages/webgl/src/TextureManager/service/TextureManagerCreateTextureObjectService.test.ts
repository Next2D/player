import { execute } from "./TextureManagerCreateTextureObjectService";
import { describe, expect, it, vi } from "vitest";

describe("TextureManagerCreateTextureObjectService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return  "createTexture" })
                }
            }
        });

        const textureObject = execute(200, 300, true);
        expect(textureObject.resource).toBe("createTexture");
        expect(textureObject.width).toBe(200);
        expect(textureObject.height).toBe(300);
        expect(textureObject.area).toBe(200 * 300);
        expect(textureObject.smoothing).toBe(true);
        expect(textureObject.dirty).toBe(false);
    });
});