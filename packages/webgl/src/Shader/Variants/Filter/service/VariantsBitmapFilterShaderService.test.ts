import { execute } from "./VariantsBitmapFilterShaderService";
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

vi.mock("../../../Fragment/Filter/FragmentShaderSourceFilter.ts", () => ({
    BITMAP_FILTER_TEMPLATE: vi.fn(() => "bitmap-filter-source")
}));

import { $collection } from "../../FilterVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBitmapFilterShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create bitmap filter shader", () =>
    {
        const result = execute(
            true,   // transforms_base
            true,   // transforms_blur
            false,  // is_glow
            "i",    // type
            false,  // knockout
            true,   // applies_strength
            false   // is_gradient
        );

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create glow filter shader", () =>
    {
        const result = execute(
            false, false, true, "o", false, true, false
        );

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(true, true, false, "i", false, true, false);
        execute(true, true, false, "i", false, true, false);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(true, true, false, "i", false, true, false);
        execute(false, false, true, "o", true, false, true);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
