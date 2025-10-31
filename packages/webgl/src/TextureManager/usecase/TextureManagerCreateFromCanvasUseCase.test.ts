import { execute } from "./TextureManagerCreateFromCanvasUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

describe("TextureManagerCreateFromCanvasUseCase.js method test", () =>
{
    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    it("test case with OffscreenCanvas", async () =>
    {
        const mockTexture = {
            width: 320,
            height: 240,
            area: 76800,
            resource: "mockTexture",
            smooth: false
        };

        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return "createTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" }),
                    "texSubImage2D": vi.fn(() => { return "texSubImage2D" }),
                    "TEXTURE_2D": 3553,
                    "RGBA": 6408,
                    "UNSIGNED_BYTE": 5121,
                }
            }
        });

        vi.mock("./TextureManagerGetTextureUseCase.ts", () => ({
            execute: vi.fn((width: number, height: number) => ({
                width,
                height,
                area: width * height,
                resource: "mockTexture",
                smooth: false
            }))
        }));

        const mockCanvas = {
            width: 320,
            height: 240
        } as OffscreenCanvas;

        const textureObject = execute(320, 240, mockCanvas);
        expect(textureObject.width).toBe(320);
        expect(textureObject.height).toBe(240);
    });

    it("test case with smooth parameter", async () =>
    {
        vi.mock("../../WebGLUtil.ts", async (importOriginal) => 
        {
            const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
            return {
                ...mod,
                $gl: {
                    "createTexture": vi.fn(() => { return "createTexture" }),
                    "activeTexture": vi.fn(() => { return "activeTexture" }),
                    "bindTexture": vi.fn(() => { return "bindTexture" }),
                    "texParameteri": vi.fn(() => { return "texParameteri" }),
                    "texStorage2D": vi.fn(() => { return "texStorage2D" }),
                    "texSubImage2D": vi.fn(() => { return "texSubImage2D" }),
                    "TEXTURE_2D": 3553,
                    "RGBA": 6408,
                    "UNSIGNED_BYTE": 5121,
                }
            }
        });

        vi.mock("./TextureManagerGetTextureUseCase.ts", () => ({
            execute: vi.fn((width: number, height: number, smooth: boolean) => ({
                width,
                height,
                area: width * height,
                resource: "mockTexture",
                smooth
            }))
        }));

        const mockCanvas = {
            width: 100,
            height: 100
        } as OffscreenCanvas;

        const textureObject = execute(100, 100, mockCanvas, true);
        expect(textureObject.width).toBe(100);
        expect(textureObject.height).toBe(100);
    });
});
