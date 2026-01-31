import { execute } from "./FilterApplyConvolutionFilterUseCase";
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

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/Variants/Filter/service/VariantsConvolutionFilterShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetConvolutionFilterUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Filter", () => ({
    $intToR: vi.fn(() => 0),
    $intToG: vi.fn(() => 0),
    $intToB: vi.fn(() => 0)
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

describe("FilterApplyConvolutionFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply 3x3 identity convolution filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const identityMatrix = new Float32Array([
            0, 0, 0,
            0, 1, 0,
            0, 0, 0
        ]);

        const result = execute(mockTextureObject, 3, 3, identityMatrix);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply edge detection convolution filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 200,
            height: 150,
            area: 30000,
            smooth: true
        };

        const edgeDetectionMatrix = new Float32Array([
            -1, -1, -1,
            -1,  8, -1,
            -1, -1, -1
        ]);

        const result = execute(mockTextureObject, 3, 3, edgeDetectionMatrix, 1, 0, true, true, 0, 0);

        expect(result).toBeDefined();
    });

    it("test case - should apply sharpen convolution filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const sharpenMatrix = new Float32Array([
            0, -1, 0,
            -1, 5, -1,
            0, -1, 0
        ]);

        const result = execute(mockTextureObject, 3, 3, sharpenMatrix, 1, 0, true, true, 0, 0);

        expect(result).toBeDefined();
    });

    it("test case - should apply emboss convolution filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 512,
            height: 512,
            area: 262144,
            smooth: false
        };

        const embossMatrix = new Float32Array([
            -2, -1, 0,
            -1, 1, 1,
            0, 1, 2
        ]);

        const result = execute(mockTextureObject, 3, 3, embossMatrix, 1, 128, false, false, 0x808080, 1);

        expect(result).toBeDefined();
    });

    it("test case - should apply box blur convolution filter with divisor", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 5,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const boxBlurMatrix = new Float32Array([
            1, 1, 1,
            1, 1, 1,
            1, 1, 1
        ]);

        const result = execute(mockTextureObject, 3, 3, boxBlurMatrix, 9, 0, true, true, 0, 0);

        expect(result).toBeDefined();
    });
});
