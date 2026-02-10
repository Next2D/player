import { execute } from "./VariantsBlendMatrixTextureShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../BlendVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../../../Vertex/VertexShaderSource.ts", () => ({
    BLEND_MATRIX_TEMPLATE: vi.fn(() => "matrix-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceTexture.ts", () => ({
    TEXTURE: vi.fn(() => "texture-source")
}));

import { $collection } from "../../BlendVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBlendMatrixTextureShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create matrix texture shader", () =>
    {
        const result = execute();

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create shader with color transform", () =>
    {
        const result = execute(true);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(false);
        execute(false);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(false);
        execute(true);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
