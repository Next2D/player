import { execute } from "./ContextDrawPixelsUseCase";
import { describe, expect, it, beforeEach, vi } from "vitest";
import type { Node } from "@next2d/texture-packer";

vi.mock("../../TextureManager/usecase/TextureManagerCreateFromPixelsUseCase", () => ({
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

describe("ContextDrawPixelsUseCase.js method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should execute draw pixels", () =>
    {
        const mockNode: Node = {
            x: 0,
            y: 0,
            w: 100,
            h: 100,
            children: [],
            characterId: 1
        } as Node;

        const pixels = new Uint8Array([255, 0, 0, 255, 0, 255, 0, 255]);

        expect(() => {
            execute(mockNode, pixels);
        }).not.toThrow();
    });

    it("test case - should handle empty pixels", () =>
    {
        const mockNode: Node = {
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            children: [],
            characterId: 1
        } as Node;

        const pixels = new Uint8Array([]);

        expect(() => {
            execute(mockNode, pixels);
        }).not.toThrow();
    });
});
