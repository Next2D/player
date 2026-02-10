import { execute } from "./FilterApplyColorMatrixFilterUseCase";
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

vi.mock("../../../Shader/Variants/Filter/service/VariantsColorMatrixFilterShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetColorMatrixFilterUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
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

describe("FilterApplyColorMatrixFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply color matrix filter with identity matrix", () =>
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
            1, 0, 0, 0, 0,
            0, 1, 0, 0, 0,
            0, 0, 1, 0, 0,
            0, 0, 0, 1, 0
        ]);

        const result = execute(mockTextureObject, identityMatrix);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply grayscale color matrix filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 200,
            height: 150,
            area: 30000,
            smooth: true
        };

        const grayscaleMatrix = new Float32Array([
            0.3, 0.3, 0.3, 0, 0,
            0.59, 0.59, 0.59, 0, 0,
            0.11, 0.11, 0.11, 0, 0,
            0, 0, 0, 1, 0
        ]);

        const result = execute(mockTextureObject, grayscaleMatrix);

        expect(result).toBeDefined();
    });

    it("test case - should apply brightness adjustment matrix", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const brightnessMatrix = new Float32Array([
            1, 0, 0, 0, 50,
            0, 1, 0, 0, 50,
            0, 0, 1, 0, 50,
            0, 0, 0, 1, 0
        ]);

        const result = execute(mockTextureObject, brightnessMatrix);

        expect(result).toBeDefined();
    });

    it("test case - should apply contrast adjustment matrix", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 512,
            height: 512,
            area: 262144,
            smooth: false
        };

        const contrast = 1.5;
        const contrastMatrix = new Float32Array([
            contrast, 0, 0, 0, 128 * (1 - contrast),
            0, contrast, 0, 0, 128 * (1 - contrast),
            0, 0, contrast, 0, 128 * (1 - contrast),
            0, 0, 0, 1, 0
        ]);

        const result = execute(mockTextureObject, contrastMatrix);

        expect(result).toBeDefined();
    });
});
