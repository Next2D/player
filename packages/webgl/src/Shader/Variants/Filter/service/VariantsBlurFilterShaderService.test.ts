import { execute } from "./VariantsBlurFilterShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../FilterVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../../../Vertex/VertexShaderSource.ts", () => ({
    TEXTURE_TEMPLATE: vi.fn(() => "texture-vertex-source")
}));

vi.mock("../../../Fragment/Filter/FragmentShaderSourceBlurFilter.ts", () => ({
    BLUR_FILTER_TEMPLATE: vi.fn(() => "blur-filter-source")
}));

import { $collection } from "../../FilterVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBlurFilterShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create blur filter shader", () =>
    {
        const result = execute(4);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(4);
        execute(4);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different blur sizes", () =>
    {
        execute(4);
        execute(8);
        execute(16);

        expect(ShaderManager).toHaveBeenCalledTimes(3);
    });
});
