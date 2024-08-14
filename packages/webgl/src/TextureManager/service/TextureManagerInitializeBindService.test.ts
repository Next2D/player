import { execute } from "./TextureManagerInitializeBindService";
import { describe, expect, it, vi } from "vitest";

describe("TextureManagerInitializeBindService.js method test", () =>
{
    it("test case", () =>
    {
        const result = "";
        vi.mock("../../WebGLUtil.ts", async (importOriginal) =>
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" })
                }
            }
        });

        const textureObject = {
            "resource": {} as WebGLTexture,
            "width": 200,
            "height": 300,
            "area": 200 * 300
        };

        execute(textureObject);
        expect(result).toBe("");
    });
});