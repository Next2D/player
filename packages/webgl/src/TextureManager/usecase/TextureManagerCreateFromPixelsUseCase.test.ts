import { execute } from "./TextureManagerCreateFromPixelsUseCase";
import { $setActiveTextureUnit } from "../../TextureManager";
import { describe, expect, it, vi } from "vitest";

describe("TextureManagerCreateFromPixelsUseCase.js method test", () =>
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
                    "texSubImage2D": vi.fn((a, b, c, d, width, height, e, f, pixels) => {
                        expect(width).toBe(100);
                        expect(height).toBe(200);
                        expect(pixels.length).toBe(100 * 200 * 4);
                    }),
                }
            }
        });

        // not hit
        $setActiveTextureUnit(-1);
        const textureObject = execute(100, 200, new Uint8Array(100 * 200 * 4), true);

        expect(textureObject.width).toBe(100);
        expect(textureObject.height).toBe(200);
    });
});