import { execute } from "./TextureManagerReleaseTextureObjectUseCase";
import { $acquirePooledTexture } from "../../TextureManager";
import { describe, expect, it, vi } from "vitest";

describe("TextureManagerReleaseTextureObjectUseCase.js method test", () =>
{
    it("test case", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "deleteTexture": vi.fn((object) => { return object.delete = true; })
                }
            }
        });

        const createTextureObject = (width: number, height: number) => ({
            "id": 0,
            "resource": {
                "delete": false
            } as unknown as WebGLTexture,
            "width": width,
            "height": height,
            "area": width * height,
            "smooth": false,
            "dirty": false,
            "pooled": false
        });

        // 1回目の解放はプールへ返却され、deleteTextureは呼ばれない
        const textureObject = createTextureObject(620, 480);
        execute(textureObject);
        // @ts-ignore
        expect(textureObject.resource.delete).toBe(false);
        expect(textureObject.pooled).toBe(true);
        expect(textureObject.dirty).toBe(true);

        // プールから同一サイズで再取得できる
        expect($acquirePooledTexture(620, 480)).toBe(textureObject);
        expect(textureObject.pooled).toBe(false);

        // バケット上限(4)を超えた解放は deleteTexture される
        const textureObjects = [];
        for (let idx = 0; idx < 4; ++idx) {
            const object = createTextureObject(128, 128);
            textureObjects.push(object);
            execute(object);
            // @ts-ignore
            expect(object.resource.delete).toBe(false);
        }

        const overflowTextureObject = createTextureObject(128, 128);
        execute(overflowTextureObject);
        // @ts-ignore
        expect(overflowTextureObject.resource.delete).toBe(true);
        expect(overflowTextureObject.pooled).toBe(false);

        // 後始末: プールを空にして他テストへの影響を防ぐ
        $acquirePooledTexture(620, 480);
        for (let idx = 0; idx < 4; ++idx) {
            $acquirePooledTexture(128, 128);
        }
    });
});
