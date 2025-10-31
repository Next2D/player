import { execute } from "./ContextLinearGradientFillUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { IVertexArrayObject } from "../../interface/IVertexArrayObject";
import * as GradientModule from "../../Gradient";

vi.mock("../../Shader/GradientLUTGenerator/usecase/GradientLUTGenerateShapeTextureUseCase", () => ({
    execute: vi.fn(() => ({ width: 256, height: 1 }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Shape/service/VariantsShapeMaskShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMaskUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Gradient/usecase/VariantsGradientShapeShaderUseCase", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetGradientFillUniformService", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            disable: vi.fn(),
            enable: vi.fn(),
            stencilFunc: vi.fn(),
            stencilOpSeparate: vi.fn(),
            colorMask: vi.fn(),
            stencilOp: vi.fn(),
            frontFace: vi.fn(),
            stencilMask: vi.fn(),
            STENCIL_TEST: 0,
            CCW: 1,
            ALWAYS: 2,
            KEEP: 3,
            INCR_WRAP: 4,
            DECR_WRAP: 5,
            FRONT: 6,
            BACK: 7,
            SAMPLE_ALPHA_TO_COVERAGE: 8,
            NOTEQUAL: 9
        },
        $context: {
            $matrix: new Float32Array([1, 0, 0, 1, 0, 0])
        },
        $linearGradientXY: vi.fn(() => new Float32Array([0, 0, 1, 1])),
        $inverseMatrix: vi.fn(() => new Float32Array([1, 0, 0, 1, 0, 0])),
        $poolFloat32Array4: vi.fn(),
        $poolFloat32Array6: vi.fn()
    };
});

describe("ContextLinearGradientFillUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(GradientModule.$gradientData, "shift")
            .mockReturnValueOnce([0, 0x000000, 1, 0xffffff])
            .mockReturnValueOnce(new Float32Array([1, 0, 0, 1, 0, 0]))
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0);
    });

    it("test case - should execute linear gradient fill shader", () =>
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
        vi.spyOn(GradientModule.$gradientData, "shift")
            .mockReturnValueOnce([0, 0x000000, 1, 0xffffff])
            .mockReturnValueOnce(new Float32Array([1, 0, 0, 1, 0, 0]))
            .mockReturnValueOnce(0)
            .mockReturnValueOnce(0);

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
