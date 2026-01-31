import { execute } from "./VariantsColorMatrixFilterShaderService";
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

vi.mock("../../../Fragment/Filter/FragmentShaderSourceColorMatrixFilter.ts", () => ({
    COLOR_MATRIX_FILTER_TEMPLATE: vi.fn(() => "color-matrix-filter-source")
}));

import { $collection } from "../../FilterVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsColorMatrixFilterShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create color matrix filter shader", () =>
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
