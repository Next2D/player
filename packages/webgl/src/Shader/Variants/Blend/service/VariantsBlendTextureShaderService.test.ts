import { execute } from "./VariantsBlendTextureShaderService";
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
    BLEND_TEMPLATE: vi.fn(() => "blend-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceTexture.ts", () => ({
    TEXTURE: vi.fn(() => "texture-source")
}));

import { $collection } from "../../BlendVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBlendTextureShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create texture shader", () =>
    {
        const result = execute();

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute();
        execute();

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });
});
