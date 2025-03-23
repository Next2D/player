import { execute } from "./TextureManagerGetTextureUseCase.ts";
import { describe, expect, it, vi } from "vitest";

describe("TextureManagerGetTextureUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return  "createTexture" }),
                    "activeTexture": vi.fn(() => { return  "activeTexture" }),
                    "bindTexture": vi.fn(() => { return  "bindTexture" }),
                    "texParameteri": vi.fn(() => { return  "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return  "texStorage2D" }),
                }
            }
        });

        // new
        // $objectPool.length = 0;
        const newTextureObject = execute(320, 240);
        expect(newTextureObject.width).toBe(320);
        expect(newTextureObject.height).toBe(240);
        expect(newTextureObject.area).toBe(320 * 240);
    });
});