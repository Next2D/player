import { execute } from "./ContextClipUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import * as MaskModule from "../../Mask";
import * as MeshModule from "../../Mesh";
import * as GridModule from "../../Grid";

vi.mock("../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase", () => ({
    execute: vi.fn(() => ({ vertexArrayObject: {}, indexBuffer: {} }))
}));
vi.mock("../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService", () => ({
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
vi.mock("../../Mask/service/MaskUnionMaskService", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            enable: vi.fn(),
            disable: vi.fn(),
            scissor: vi.fn(),
            stencilMask: vi.fn(),
            SCISSOR_TEST: 0
        },
        $context: {
            currentAttachmentObject: null
        }
    };
});

describe("ContextClipUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(MeshModule, "$clearFillBufferSetting").mockImplementation(() => {});
        vi.spyOn(GridModule, "$terminateGrid").mockImplementation(() => {});
        Object.defineProperty(MeshModule, "$fillBufferIndexes", {
            value: [],
            writable: true,
            configurable: true
        });
        Object.defineProperty(GridModule, "$gridDataMap", {
            value: new Map(),
            writable: true,
            configurable: true
        });
        Object.defineProperty(MaskModule, "$clipLevels", {
            value: new Map(),
            writable: true,
            configurable: true
        });
        Object.defineProperty(MaskModule, "$clipBounds", {
            value: new Map(),
            writable: true,
            configurable: true
        });
    });

    it("test case - should execute clip operation", () =>
    {
        expect(() => {
            execute();
        }).not.toThrow();
    });
});
