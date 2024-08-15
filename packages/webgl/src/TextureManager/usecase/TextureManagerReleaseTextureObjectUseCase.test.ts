import { execute } from "./TextureManagerReleaseTextureObjectUseCase";
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

        const textureObject = {
            "resource": {
                "delete": false
            } as unknown as WebGLTexture,
            "width": 620,
            "height": 480,
            "area": 620 * 480,
            "dirty": false,
        };

        // @ts-ignore
        expect(textureObject.resource.delete).toBe(false);
        execute(textureObject);
        // @ts-ignore
        expect(textureObject.resource.delete).toBe(true);
    });
});