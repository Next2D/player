import { execute } from "./VariantsBitmapShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../BitmapVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderManager.ts", () => {
    const MockShaderManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-shader";
    });
    return { ShaderManager: MockShaderManager };
});

vi.mock("../../../Vertex/VertexShaderSourceFill.ts", () => ({
    FILL_TEMPLATE: vi.fn(() => "vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSource.ts", () => ({
    BITMAP_PATTERN: vi.fn(() => "pattern-source"),
    BITMAP_CLIPPED: vi.fn(() => "clipped-source")
}));

import { $collection } from "../../BitmapVariants";
import { ShaderManager } from "../../../ShaderManager";

describe("VariantsBitmapShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create bitmap shader with repeat", () =>
    {
        const result = execute(true, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should create bitmap shader without repeat", () =>
    {
        const result = execute(false, false);

        expect(ShaderManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute(true, false);
        execute(true, false);

        expect(ShaderManager).toHaveBeenCalledTimes(1);
    });

    it("test case - should create different shaders for different params", () =>
    {
        execute(true, false);
        execute(false, false);

        expect(ShaderManager).toHaveBeenCalledTimes(2);
    });
});
