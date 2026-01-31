import { execute } from "./FilterApplyBevelFilterUseCase";
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

vi.mock("../../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
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

vi.mock("../../../Blend/service/BlendEraseService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../BlurFilter/usecase/FilterApplyBlurFilterUseCase", () => ({
    execute: vi.fn(() => ({
        id: 2,
        resource: {},
        width: 120,
        height: 120,
        area: 14400,
        smooth: false
    }))
}));

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase", () => ({
    execute: vi.fn(() => ({
        id: 3,
        resource: {},
        width: 130,
        height: 130,
        area: 16900,
        smooth: false
    }))
}));

vi.mock("../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Filter", () => ({
    $offset: { x: 0, y: 0 },
    $intToR: vi.fn(() => 1),
    $intToG: vi.fn(() => 1),
    $intToB: vi.fn(() => 1)
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

describe("FilterApplyBevelFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply bevel filter with default parameters", () =>
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

    it("test case - should apply bevel filter with custom distance and angle", () =>
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

        const result = execute(
            mockTextureObject, matrix,
            8,          // distance
            135         // angle
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply bevel filter with custom colors", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45,
            0xFFFFFF,   // highlight_color
            1,          // highlight_alpha
            0x000000,   // shadow_color
            1           // shadow_alpha
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply inner bevel filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45, 0xFFFFFF, 1, 0x000000, 1,
            4, 4, 1, 1,
            1           // type = inner
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply outer bevel filter", () =>
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

        const result = execute(
            mockTextureObject, matrix,
            4, 45, 0xFFFFFF, 1, 0x000000, 1,
            4, 4, 1, 1,
            2           // type = outer
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply knockout bevel filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 6,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45, 0xFFFFFF, 1, 0x000000, 1,
            4, 4, 1, 1,
            0,          // type = full
            true        // knockout
        );

        expect(result).toBeDefined();
    });
});
