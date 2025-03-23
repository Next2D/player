import { execute } from "./TextureManagerCreateAtlasTextureUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setActiveTextureUnit } from "../../TextureManager";
import { $RENDER_MAX_SIZE } from "../../WebGLUtil.ts";

describe("TextureManagerCreateAtlasTextureUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "activeTexture": vi.fn((v) => 
                    {
                        expect(v).toBe(0);
                    }),
                    "createTexture": vi.fn(() => { return "createTexture" }),
                    "bindTexture": vi.fn((a, v) =>
                    {
                        expect(v).toBe("createTexture");
                    }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" }),
                    "TEXTURE0": 0,
                    "TEXTURE3": 0,
                }
            }
        });

        // not hit
        $setActiveTextureUnit(-1);
        
        const textureObject = execute();
        expect(textureObject.width).toBe($RENDER_MAX_SIZE);
        expect(textureObject.height).toBe($RENDER_MAX_SIZE);
    });
});