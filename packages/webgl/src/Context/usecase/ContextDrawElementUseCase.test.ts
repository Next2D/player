import { execute } from "./ContextDrawElementUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { Node } from "@next2d/texture-packer";

vi.mock("../../TextureManager/usecase/TextureManagerCreateFromCanvasUseCase", () => ({
    execute: vi.fn(() => ({ width: 100, height: 100 }))
}));
vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/Variants/Blend/service/VariantsBlendTextureShaderService", () => ({
    execute: vi.fn(() => ({}))
}));
vi.mock("../../Shader/ShaderManager/service/ShaderManagerSetTextureUniformService", () => ({
    execute: vi.fn()
}));
vi.mock("../../Shader/ShaderManager/usecase/ShaderManagerDrawTextureUseCase", () => ({
    execute: vi.fn()
}));
vi.mock("../../Blend/service/BlendResetService", () => ({
    execute: vi.fn()
}));

describe("ContextDrawElementUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute draw element with OffscreenCanvas", () =>
    {
        const mockNode: Node = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            children: [],
            characterId: 1
        } as Node;

        const mockCanvas = {} as OffscreenCanvas;

        expect(() => {
            execute(mockNode, mockCanvas);
        }).not.toThrow();
    });

    it("test case - should execute draw element with ImageBitmap", () =>
    {
        const mockNode: Node = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            children: [],
            characterId: 1
        } as Node;

        const mockImageBitmap = {} as ImageBitmap;

        expect(() => {
            execute(mockNode, mockImageBitmap);
        }).not.toThrow();
    });
});
