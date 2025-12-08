import { execute } from "./ContextDrawFillUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import * as MeshModule from "../../Mesh";
import * as GridModule from "../../Grid";

vi.mock("../../VertexArrayObject/usecase/VertexArrayObjectBindFillMeshUseCase", () => ({
    execute: vi.fn(() => ({ vertexArrayObject: {}, indexBuffer: {} }))
}));
vi.mock("../../VertexArrayObject/service/VertexArrayObjectReleaseVertexArrayObjectService", () => ({
    execute: vi.fn()
}));
vi.mock("./ContextNormalFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("./ContextLinearGradientFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("./ContextRadialGradientFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("./ContextPatternBitmapFillUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Stencil/service/StencilResetService", () => ({
    execute: vi.fn()
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $gl: {
            enable: vi.fn(),
            disable: vi.fn(),
            frontFace: vi.fn(),
            stencilMask: vi.fn(),
            STENCIL_TEST: 0,
            CCW: 1
        }
    };
});

describe("ContextDrawFillUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(MeshModule, "$clearFillBufferSetting").mockImplementation(() => {});
        vi.spyOn(GridModule, "$terminateGrid").mockImplementation(() => {});
        Object.defineProperty(MeshModule, "$fillTypes", {
            value: [],
            writable: true,
            configurable: true
        });
        Object.defineProperty(MeshModule, "$fillBufferIndexes", {
            value: { shift: vi.fn() },
            writable: true,
            configurable: true
        });
        Object.defineProperty(GridModule, "$gridDataMap", {
            value: new Map(),
            writable: true,
            configurable: true
        });
    });

    it("test case - should execute draw fill", () =>
    {
        expect(() => {
            execute();
        }).not.toThrow();
    });
});
