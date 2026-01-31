import { execute } from "./VariantsDisplacementMapFilterShaderService";
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

vi.mock("../../../Fragment/Filter/FragmentShaderSourceDisplacementMapFilter.ts", () => ({
    DISPLACEMENT_MAP_FILTER_TEMPLATE: vi.fn(() => "displacement-filter-source")
}));

import { $collection } from "../../FilterVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsDisplacementMapFilterShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create displacement map filter shader", () =>
    {
        const result = execute(1, 2, 0);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create shader with color mode", () =>
    {
        const result = execute(1, 2, 1);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(1, 2, 0);
        execute(1, 2, 0);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(1, 2, 0);
        execute(3, 4, 1);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
