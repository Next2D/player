import { execute } from "./FilterApplyBitmapFilterUseCase";
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

vi.mock("../../../TextureManager/usecase/TextureManagerBind01UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerBind02UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerBind012UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendOneZeroService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendSourceInService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendSourceAtopService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/Variants/Filter/service/VariantsBitmapFilterShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetBitmapFilterUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateFilterTextureUseCase", () => ({
    execute: vi.fn(() => ({
        id: 10,
        resource: {},
        width: 256,
        height: 1,
        area: 256,
        smooth: true
    }))
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
        }
    };
});

describe("FilterApplyBitmapFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply outer glow bitmap filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const mockBlurTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 120,
            height: 120,
            area: 14400,
            smooth: false
        };

        const result = execute(
            mockTextureObject, mockBlurTextureObject,
            130, 130,
            100, 100, 10, 10,
            120, 120, 0, 0,
            true, "outer", false,
            1, null, null, null,
            1, 0, 0, 1,
            0, 0, 0, 0
        );

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply inner glow bitmap filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const mockBlurTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const result = execute(
            mockTextureObject, mockBlurTextureObject,
            100, 100,
            100, 100, 0, 0,
            100, 100, 0, 0,
            true, "inner", false,
            1, null, null, null,
            0, 1, 0, 1,
            0, 0, 0, 0
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply knockout bitmap filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const mockBlurTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 120,
            height: 120,
            area: 14400,
            smooth: false
        };

        const result = execute(
            mockTextureObject, mockBlurTextureObject,
            120, 120,
            100, 100, 10, 10,
            120, 120, 0, 0,
            true, "outer", true,
            2, null, null, null,
            0, 0, 1, 1,
            0, 0, 0, 0
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply gradient bitmap filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const mockBlurTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 120,
            height: 120,
            area: 14400,
            smooth: false
        };

        const ratios = new Float32Array([0, 0.5, 1]);
        const colors = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const alphas = new Float32Array([1, 1, 1]);

        const result = execute(
            mockTextureObject, mockBlurTextureObject,
            120, 120,
            100, 100, 10, 10,
            120, 120, 0, 0,
            true, "outer", false,
            1, ratios, colors, alphas,
            0, 0, 0, 0,
            0, 0, 0, 0
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply bevel filter with full type", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const mockBlurTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 120,
            height: 120,
            area: 14400,
            smooth: false
        };

        const result = execute(
            mockTextureObject, mockBlurTextureObject,
            130, 130,
            100, 100, 15, 15,
            120, 120, 5, 5,
            false, "full", false,
            1, null, null, null,
            1, 1, 1, 1,
            0, 0, 0, 1
        );

        expect(result).toBeDefined();
    });
});
