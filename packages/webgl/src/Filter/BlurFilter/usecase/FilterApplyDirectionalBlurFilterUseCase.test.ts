import { execute } from "./FilterApplyDirectionalBlurFilterUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../../interface/ITextureObject";

vi.mock("../../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/Variants/Filter/service/VariantsBlurFilterShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetBlurFilterUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

describe("FilterApplyDirectionalBlurFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply horizontal blur filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        expect(() => {
            execute(mockTextureObject, true, 8);
        }).not.toThrow();
    });

    it("test case - should apply vertical blur filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 200,
            height: 150,
            area: 30000,
            smooth: true
        };

        expect(() => {
            execute(mockTextureObject, false, 16);
        }).not.toThrow();
    });

    it("test case - should handle small blur values", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 50,
            height: 50,
            area: 2500,
            smooth: false
        };

        expect(() => {
            execute(mockTextureObject, true, 1);
        }).not.toThrow();
    });

    it("test case - should handle large blur values", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 512,
            height: 512,
            area: 262144,
            smooth: false
        };

        expect(() => {
            execute(mockTextureObject, false, 64);
        }).not.toThrow();
    });
});
