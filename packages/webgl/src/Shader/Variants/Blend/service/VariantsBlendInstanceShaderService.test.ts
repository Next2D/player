import { execute } from "./VariantsBlendInstanceShaderService";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../BlendVariants.ts", () => ({
    $collection: new Map()
}));

vi.mock("../../../ShaderInstancedManager.ts", () => {
    const MockShaderInstancedManager = vi.fn(function(this: { id: string }) {
        this.id = "mock-instanced-shader";
    });
    return { ShaderInstancedManager: MockShaderInstancedManager };
});

vi.mock("../../../Vertex/VertexShaderSource.ts", () => ({
    INSTANCE_TEMPLATE: vi.fn(() => "instance-vertex-source")
}));

vi.mock("../../../Fragment/FragmentShaderSourceTexture.ts", () => ({
    INSTANCE_TEXTURE: vi.fn(() => "instance-texture-source")
}));

import { $collection } from "../../BlendVariants";
import { ShaderInstancedManager } from "../../../ShaderInstancedManager";

describe("VariantsBlendInstanceShaderService.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $collection.clear();
    });

    it("test case - should create instanced shader", () =>
    {
        const result = execute();

        expect(ShaderInstancedManager).toHaveBeenCalled();
        expect(result).toBeDefined();
    });

    it("test case - should cache shader", () =>
    {
        execute();
        execute();

        expect(ShaderInstancedManager).toHaveBeenCalledTimes(1);
    });
});
