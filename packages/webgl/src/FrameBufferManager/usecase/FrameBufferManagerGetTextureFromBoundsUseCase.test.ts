import { execute } from "./FrameBufferManagerGetTextureFromBoundsUseCase";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerGetTextureFromBoundsUseCase.js method test", () =>
{
    it("test case1", () =>
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
                    "createRenderbuffer": vi.fn(() => { return "createRenderbuffer" }),
                    "bindRenderbuffer": vi.fn(() => { return "bindRenderbuffer" }),
                    "renderbufferStorage": vi.fn(() => { return "renderbufferStorage" }),
                    "TEXTURE0": 0,
                    "TEXTURE_2D": 0,
                    "LINEAR": 0,
                    "CLAMP_TO_EDGE": 0,
                    "RGBA8": 0,
                    "RENDERBUFFER": 0,
                    "STENCIL_INDEX8": 0
                },
                $context: {
                    "currentAttachmentObject": null,
                    "bind": vi.fn(),
                    "save": vi.fn(),
                    "setTransform": vi.fn(),
                    "restore": vi.fn()
                }
            }
        });

        vi.mock("../../TextureManager/usecase/TextureManagerGetMainTextureFromBoundsUseCase", () => ({
            execute: vi.fn(() => ({
                id: 0,
                resource: "mainTexture",
                width: 100,
                height: 100,
                area: 10000,
                smooth: false
            }))
        }));

        vi.mock("../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService", () => ({
            execute: vi.fn(() => ({
                program: "shaderProgram",
                uniforms: {}
            }))
        }));

        vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../Blend/service/BlendResetService", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
            execute: vi.fn()
        }));

        const textureObject = execute(10, 20, 100, 100);
        expect(textureObject).toBeDefined();
        expect(textureObject.width).toBe(100);
        expect(textureObject.height).toBe(100);
    });
});
