import { execute } from "./VariantsGradientShapeShaderUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../GradientVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../service/VariantsGradientCreateCollectionKeyService.ts", () => ({
    execute: vi.fn((useGrid, isRadial, hasFocal, spread) =>
        `g${useGrid ? "y" : "n"}${isRadial ? "r" : "l"}${hasFocal ? "f" : "n"}${spread}`)
}));

vi.mock("../../../Vertex/VertexShaderSourceFill.ts", () => ({
    FILL_TEMPLATE: vi.fn(() => "fill-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceGradient.ts", () => ({
    GRADIENT_TEMPLATE: vi.fn(() => "gradient-source")
}));

import { $collection } from "../../GradientVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsGradientShapeShaderUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create linear gradient shader", () =>
    {
        const result = execute(false, false, 0, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create radial gradient shader", () =>
    {
        const result = execute(true, false, 0, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create radial gradient shader with focal point", () =>
    {
        const result = execute(true, true, 0, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(false, false, 0, false);
        execute(false, false, 0, false);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(false, false, 0, false);
        execute(true, true, 1, true);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
