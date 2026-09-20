import { execute } from "./TextureManagerBind0UseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $activeTextureUnit,
    $setActiveTextureUnit,
    $boundTextures
} from "../../TextureManager";
import type { ITextureObject } from "../../interface/ITextureObject";

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

describe("TextureManagerBind0UseCase.js method test", () =>
{
    it("test case", async () =>
    {
        const textureObject = {
            "id": 2,
            "resource": {} as WebGLTexture,
            "width": 200,
            "height": 300,
            "area": 200 * 300
        } as ITextureObject;

        // not hit
        $setActiveTextureUnit(-1);
        expect($activeTextureUnit).toBe(-1);

        const mock = {
            "id": 0,
            "resource": {} as WebGLTexture,
            "width": 100,
            "height": 100,
            "area": 100 * 100
        } as ITextureObject;

        $boundTextures[0] = mock;
        $boundTextures[1] = mock;
        $boundTextures[2] = mock;
        expect($boundTextures[0]).toBe(mock);
        expect($boundTextures[1]).toBe(mock);
        expect($boundTextures[2]).toBe(mock);

        execute(textureObject)
        expect($activeTextureUnit).toBe(0);
        expect($boundTextures[0]).toBe(textureObject);
        expect($boundTextures[1]).toBe(null);
        expect($boundTextures[2]).toBe(null);
    });
});
