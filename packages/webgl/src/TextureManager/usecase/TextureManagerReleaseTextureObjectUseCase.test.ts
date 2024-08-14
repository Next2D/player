import { execute } from "./TextureManagerReleaseTextureObjectUseCase";
import { describe, expect, it } from "vitest";
import { $objectPool } from "../../TextureManager";

describe("TextureManagerReleaseTextureObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        $objectPool.length = 0;
        $objectPool.push(
            {
                "resource": {} as unknown as WebGLTexture,
                "width": 256,
                "height": 256,
                "area": 256 * 256,
            },
            {
                "resource": {} as unknown as WebGLTexture,
                "width": 512,
                "height": 512,
                "area": 512 * 512,
            },
            {
                "resource": {} as unknown as WebGLTexture,
                "width": 1024,
                "height": 1024,
                "area": 1024 * 1024,
            },
            {
                "resource": {} as unknown as WebGLTexture,
                "width": 2048,
                "height": 2048,
                "area": 2048 * 2048,
            },
        );
        expect($objectPool.length).toBe(4);

        const textureObject = {
            "resource": {} as unknown as WebGLTexture,
            "width": 620,
            "height": 480,
            "area": 620 * 480,
            "dirty": false,
        };

        execute(textureObject);
        expect($objectPool.length).toBe(5);
        expect($objectPool[$objectPool.length - 1]).toBe(textureObject);

        // 重複チェック
        execute(textureObject);
        expect($objectPool.length).toBe(5);
    });
});