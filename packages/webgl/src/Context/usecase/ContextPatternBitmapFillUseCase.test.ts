import { execute } from "./ContextPatternBitmapFillUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import * as BitmapModule from "../../Bitmap";

vi.mock("../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Bitmap/service/VariantsBitmapShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetBitmapFillUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            stencilFunc: vi.fn(),
            stencilOpSeparate: vi.fn(),
            colorMask: vi.fn(),
            enable: vi.fn(),
            disable: vi.fn(),
            ALWAYS: 0,
            KEEP: 1,
            INCR_WRAP: 2,
            DECR_WRAP: 3,
            FRONT: 4,
            BACK: 5,
            SAMPLE_ALPHA_TO_COVERAGE: 6,
            NOTEQUAL: 7,
            stencilOp: vi.fn()
        },
        $context: {
            save: vi.fn(),
            restore: vi.fn(),
            transform: vi.fn()
        }
    };
});

describe("ContextPatternBitmapFillUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(BitmapModule.$bitmapData, "shift")
            .mockReturnValueOnce(new Uint8Array([255, 0, 0, 255]))
            .mockReturnValueOnce(new Float32Array([1, 0, 0, 1, 0, 0]))
            .mockReturnValueOnce(100)
            .mockReturnValueOnce(100)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);
    });

    it("test case - should execute pattern bitmap fill shader", () =>
    {
        const mockVertexArrayObject: IVertexArrayObject = {
            vertexArrayObject: {} as WebGLVertexArrayObject,
            indexBuffer: {} as WebGLBuffer,
        };

        const offset = 0;
        const indexCount = 3;
        const gridData = null;

        expect(() => {
            execute(mockVertexArrayObject, offset, indexCount, gridData);
        }).not.toThrow();
    });

    it("test case - should execute with grid data", () =>
    {
        vi.spyOn(BitmapModule.$bitmapData, "shift")
            .mockReturnValueOnce(new Uint8Array([255, 0, 0, 255]))
            .mockReturnValueOnce(new Float32Array([1, 0, 0, 1, 0, 0]))
            .mockReturnValueOnce(100)
            .mockReturnValueOnce(100)
            .mockReturnValueOnce(true)
            .mockReturnValueOnce(true);

        const mockVertexArrayObject: IVertexArrayObject = {
            vertexArrayObject: {} as WebGLVertexArrayObject,
            indexBuffer: {} as WebGLBuffer,
        };

        const offset = 0;
        const indexCount = 3;
        const gridData = new Float32Array([1, 0, 0, 1, 0, 0]);

        expect(() => {
            execute(mockVertexArrayObject, offset, indexCount, gridData);
        }).not.toThrow();
    });
});
