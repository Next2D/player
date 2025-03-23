import { execute } from "./TextureManagerBind0UseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $activeTextureUnit,
    $setActiveTextureUnit,
    $boundTextures
} from "../../TextureManager";

describe("TextureManagerBind0UseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "bindTexture" }),
                    "TEXTURE0": 0,
                    "TEXTURE1": 1,
                    "TEXTURE2": 2
                }
            }
        });

        const textureObject = {
            "resource": {} as WebGLTexture,
            "width": 200,
            "height": 300,
            "area": 200 * 300
        };

        // not hit
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        const mock = {
            "resource": {} as WebGLTexture,
            "width": 100,
            "height": 100,
            "area": 100 * 100
        };
        $boundTextures[0] = null;
        $boundTextures[1] = mock;
        $boundTextures[2] = mock;
        expect($boundTextures[0]).toBe(null);
        expect($boundTextures[1]).toBe(mock);
        expect($boundTextures[2]).toBe(mock);

        execute(textureObject)
        expect($activeTextureUnit).toBe(0);
        expect($boundTextures[0]).toBe(textureObject);
        expect($boundTextures[1]).toBe(null);
        expect($boundTextures[2]).toBe(null);
    });
});