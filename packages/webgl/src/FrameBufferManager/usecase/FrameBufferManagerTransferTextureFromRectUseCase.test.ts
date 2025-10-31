import type { ITextureObject } from "../../interface/ITextureObject";
import { execute } from "./FrameBufferManagerTransferTextureFromRectUseCase";
import { describe, expect, it, vi } from "vitest";

describe("FrameBufferManagerTransferTextureFromRectUseCase.js method test", () =>
{
    it("test case1", () =>
    {
        vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../Blend/service/BlendOneZeroService", () => ({
            execute: vi.fn()
        }));

        vi.mock("../../Blend/service/BlendResetService", () => ({
            execute: vi.fn()
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

        const textureObject: ITextureObject = {
            id: 0,
            resource: "texture",
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        execute(textureObject);
        expect(true).toBe(true);
    });
});
