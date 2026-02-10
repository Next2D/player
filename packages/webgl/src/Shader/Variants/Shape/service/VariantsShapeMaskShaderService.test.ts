import { execute } from "./VariantsShapeMaskShaderService";
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
    MASK: vi.fn(() => "mask-source")
}));

import { $collection } from "../../ShapeVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsShapeMaskShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create mask shader without grid", () =>
    {
        const result = execute(false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create mask shader with grid", () =>
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
