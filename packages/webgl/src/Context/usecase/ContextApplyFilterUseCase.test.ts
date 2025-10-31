import { execute } from "./ContextApplyFilterUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Node } from "@next2d/texture-packer";
import type { IBlendMode } from "../../interface/IBlendMode";

vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromNodeUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetAttachmentObjectUseCase", () => ({
    execute: vi.fn(() => ({ texture: { width: 100, height: 100 } }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerBind0UseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendMatrixTextureShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetMatrixTextureUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Blend/usecase/BlendDrawFilterToMainUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("@next2d/cache", () => ({
    $cacheStore: {
        generateFilterKeys: vi.fn(() => "filterKey"),
        get: vi.fn(() => null),
        set: vi.fn()
    }
}));
vi.mock("../../Filter", () => ({
    $offset: { x: 0, y: 0 }
}));

vi.mock("../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            currentAttachmentObject: null,
            bind: vi.fn(),
            reset: vi.fn(),
            setTransform: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            globalCompositeOperation: "normal"
        },
        $getFloat32Array6: vi.fn((...args: number[]) => new Float32Array(args)),
        $getDevicePixelRatio: vi.fn(() => 1),
        $multiplyMatrices: vi.fn(() => new Float32Array([1, 0, 0, 1, 0, 0])),
        $poolFloat32Array6: vi.fn()
    };
});

describe("ContextApplyFilterUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute filter application", () =>
    {
        const mockNode: Node = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            children: [],
            characterId: 1
        } as Node;

        const uniqueKey = "test-key";
        const updated = false;
        const width = 100;
        const height = 100;
        const isBitmap = false;
        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const blendMode: IBlendMode = "normal";
        const bounds = new Float32Array([0, 0, 100, 100]);
        const params = new Float32Array([]);

        expect(() => {
            execute(
                mockNode,
                uniqueKey,
                updated,
                width,
                height,
                isBitmap,
                matrix,
                colorTransform,
                blendMode,
                bounds,
                params
            );
        }).not.toThrow();
    });
});
