import { execute } from "./VariantsConvolutionFilterShaderService";
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

vi.mock("../../../Fragment/Filter/FragmentShaderSourceConvolutionFilter.ts", () => ({
    CONVOLUTION_FILTER_TEMPLATE: vi.fn(() => "convolution-filter-source")
}));

import { $collection } from "../../FilterVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsConvolutionFilterShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create convolution filter shader", () =>
    {
        const result = execute(3, 3, true, true);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create shader without preserve alpha", () =>
    {
        const result = execute(5, 5, false, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(3, 3, true, true);
        execute(3, 3, true, true);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(3, 3, true, true);
        execute(5, 5, false, false);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
