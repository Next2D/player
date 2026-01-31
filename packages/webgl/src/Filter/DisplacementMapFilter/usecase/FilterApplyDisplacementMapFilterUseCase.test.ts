import { execute } from "./FilterApplyDisplacementMapFilterUseCase";
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

vi.mock("../../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase", () => ({
    execute: vi.fn(() => ({
        id: 2,
        resource: {},
        width: 50,
        height: 50,
        area: 2500,
        smooth: false
    }))
}));

vi.mock("../../../TextureManager/usecase/TextureManagerBind01UseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/Variants/Filter/service/VariantsDisplacementMapFilterShaderService", () => ({
    execute: vi.fn(() => ({
        uniform: {}
    }))
}));

vi.mock("../../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Shader/ShaderManager/service/ShaderManagerSetDisplacementMapFilterUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
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
            bind: vi.fn()
        },
        $getDevicePixelRatio: vi.fn(() => 1)
    };
});

describe("FilterApplyDisplacementMapFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply displacement map filter with default parameters", () =>
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
        const bitmapBuffer = new Uint8Array(50 * 50 * 4);

        const result = execute(mockTextureObject, matrix, bitmapBuffer);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply displacement map filter with custom bitmap dimensions", () =>
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
        const bitmapBuffer = new Uint8Array(100 * 100 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            100,        // bitmap_width
            100         // bitmap_height
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply displacement map filter with custom map point", () =>
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
        const bitmapBuffer = new Uint8Array(64 * 64 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            64, 64,
            50,         // map_point_x
            50          // map_point_y
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply displacement map filter with component channels", () =>
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
        const bitmapBuffer = new Uint8Array(50 * 50 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            50, 50, 0, 0,
            1,          // component_x (green channel)
            2           // component_y (blue channel)
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply displacement map filter with scale values", () =>
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
        const bitmapBuffer = new Uint8Array(50 * 50 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            50, 50, 0, 0, 0, 0,
            20,         // scale_x
            20          // scale_y
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply displacement map filter with wrap mode", () =>
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
        const bitmapBuffer = new Uint8Array(50 * 50 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            50, 50, 0, 0, 0, 0, 10, 10,
            1           // mode = wrap
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply displacement map filter with color fill", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 7,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const bitmapBuffer = new Uint8Array(50 * 50 * 4);

        const result = execute(
            mockTextureObject, matrix,
            bitmapBuffer,
            50, 50, 0, 0, 0, 0, 10, 10, 0,
            0xFF0000,   // color
            1           // alpha
        );

        expect(result).toBeDefined();
    });
});
