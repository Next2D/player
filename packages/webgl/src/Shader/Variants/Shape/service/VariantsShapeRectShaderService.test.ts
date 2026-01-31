import { execute } from "./VariantsShapeRectShaderService";
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
    FILL_RECT_TEMPLATE: vi.fn(() => "fill-rect-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSource.ts", () => ({
    FILL_RECT_COLOR: vi.fn(() => "fill-rect-color-source")
}));

import { $collection } from "../../ShapeVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsShapeRectShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create rect shader", () =>
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
