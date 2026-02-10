import { execute } from "./VariantsGradientLUTShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../GradientLUTVariants.ts", () => {
    const cache = new Map();
    return {
        $getFromCache: vi.fn((key: string) => cache.get(key)),
        $addToCache: vi.fn((key: string, shader: unknown) => cache.set(key, shader))
    };
});

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../../../Vertex/VertexShaderSource.ts", () => ({
    TEXTURE_TEMPLATE: vi.fn(() => "texture-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceGradientLUT.ts", () => ({
    GRADIENT_LUT_TEMPLATE: vi.fn(() => "gradient-lut-source")
}));

import { $getFromCache, $addToCache } from "../../GradientLUTVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsGradientLUTShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should create gradient LUT shader", () =>
    {
        const result = execute(4, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect($addToCache).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create shader with linear space", () =>
    {
        const result = execute(8, true);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should use cached shader", () =>
    {
        execute(4, false);
        execute(4, false);

        expect($getFromCache).toHaveBeenCalled();
    });
});
