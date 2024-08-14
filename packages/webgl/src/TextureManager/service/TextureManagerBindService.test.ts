import { execute } from "./TextureManagerBindService";
import { describe, expect, it, vi } from "vitest";
import {
    $activeTextureUnit,
    $boundTextures,
    $setActiveTextureUnit
} from "../../TextureManager";

describe("TextureManagerBindService.js method test", () =>
{
    it("test case", () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                }
            }
        });

        const textureObject = {
            "resource": {} as WebGLTexture,
            "width": 200,
            "height": 300,
            "area": 200 * 300
        };

        $boundTextures[0] = null;
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);
        expect($boundTextures[0]).toBe(null);

        execute(0, 0x84C0, textureObject);
        expect($activeTextureUnit).toBe(0x84C0);
        expect($boundTextures[0]).toBe(textureObject);

        execute(0, 0x84C0, null);
        expect($boundTextures[0]).toBe(null);
    });
});