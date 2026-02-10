import { execute } from "./VariantsBlendDrawShaderService";
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
    TEXTURE_TEMPLATE: vi.fn(() => "vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceBlend.ts", () => ({
    BLEND_TEMPLATE: vi.fn(() => "blend-source")
}));

import { $collection } from "../../BlendVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBlendDrawShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create blend shader", () =>
    {
        const result = execute("normal", false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create blend shader with color transform", () =>
    {
        const result = execute("multiply", true);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute("normal", false);
        execute("normal", false);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });
});
