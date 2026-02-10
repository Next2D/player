import { execute } from "./VariantsShapeSolidColorShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../ShapeVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../../../Vertex/VertexShaderSourceFill.ts", () => ({
    FILL_TEMPLATE: vi.fn(() => "fill-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSource.ts", () => ({
    SOLID_FILL_COLOR: vi.fn(() => "solid-fill-color-source")
}));

import { $collection } from "../../ShapeVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsShapeSolidColorShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create solid color shader without grid", () =>
    {
        const result = execute(false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create solid color shader with grid", () =>
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
