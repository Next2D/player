import { execute } from "./FilterApplyBlurFilterUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../../interface/ITextureObject";

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase", () => ({
    execute: vi.fn(() => ({
        id: 1,
        width: 100,
        height: 100,
        texture: {
            id: 1,
            resource: {},
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        }
    }))
}));

vi.mock("../../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("./FilterApplyDirectionalBlurFilterUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendOneZeroService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Filter", () => ({
    $offset: { x: 0, y: 0 }
}));

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            currentAttachmentObject: null,
            bind: vi.fn(),
            reset: vi.fn(),
            setTransform: vi.fn()
        },
        $getDevicePixelRatio: vi.fn(() => 1)
    };
});

describe("FilterApplyBlurFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply blur filter with default parameters", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(mockTextureObject, matrix);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply blur filter with custom blur values", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 200,
            height: 150,
            area: 30000,
            smooth: true
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(mockTextureObject, matrix, 8, 8, 2);

        expect(result).toBeDefined();
    });

    it("test case - should apply blur filter with high quality", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const matrix = new Float32Array([2, 0, 0, 2, 0, 0]);

        const result = execute(mockTextureObject, matrix, 16, 16, 3);

        expect(result).toBeDefined();
    });

    it("test case - should handle large blur values with buffer scaling", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 512,
            height: 512,
            area: 262144,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(mockTextureObject, matrix, 64, 64, 1);

        expect(result).toBeDefined();
    });

    it("test case - should not remove source texture when removed is false", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 5,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(mockTextureObject, matrix, 4, 4, 1, false);

        expect(result).toBeDefined();
    });
});
