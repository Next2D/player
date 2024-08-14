import { execute } from "./TextureManagerCreateTextureAtlasUseCase";
import { describe, expect, it, vi } from "vitest";
import {
    $atlasTextures,
    $atlasNodes,
    $atlasCacheMap
} from "../../TextureManager";

describe("TextureManagerCreateTextureAtlasUseCase.js method test", () =>
{
    it("test case", () =>
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

        $atlasTextures.length = 0;
        $atlasNodes.clear();
        $atlasCacheMap.clear();

        expect($atlasTextures.length).toBe(0);
        expect($atlasNodes.size).toBe(0);
        expect($atlasCacheMap.size).toBe(0);
        
        execute();
        expect($atlasTextures.length).toBe(1);
        expect($atlasNodes.size).toBe(1);
        expect($atlasCacheMap.size).toBe(1);

        const textureObject = $atlasTextures[0];
        expect(textureObject.width).toBe(256);
        expect(textureObject.height).toBe(256);
        expect(textureObject.area).toBe(256 * 256);
    });
});