import { execute } from "./GradientLUTGenerateFilterTextureUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockTextureObject = { id: "gradient-texture" };
const mockAttachmentObject = { texture: mockTextureObject };

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $context: {
            currentAttachmentObject: null,
            bind: vi.fn()
        }
    };
});

vi.mock("../../../Blend/service/BlendOneZeroService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Blend/service/BlendResetService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../Variants/GradientLUT/service/VariantsGradientLUTShaderService.ts", () => ({
    execute: vi.fn(() => ({
        mediump: new Float32Array(64),
        useProgram: vi.fn(),
        bindUniform: vi.fn()
    }))
}));

vi.mock("../service/GradientLUTSetFilterUniformService.ts", () => ({
    execute: vi.fn()
}));

vi.mock("./GradientLUTGeneratorFillTextureUseCase.ts", () => ({
    execute: vi.fn()
}));

vi.mock("../../GradientLUTGenerator.ts", () => ({
    $getGradientAttachmentObject: vi.fn(() => ({
        texture: { id: "gradient-texture" }
    })),
    $getGradientLUTGeneratorMaxLength: () => 16
}));

import { $context } from "../../../WebGLUtil";
import { execute as blendOneZeroService } from "../../../Blend/service/BlendOneZeroService";
import { execute as blendResetService } from "../../../Blend/service/BlendResetService";
import { execute as variantsGradientLUTShaderService } from "../../Variants/GradientLUT/service/VariantsGradientLUTShaderService";
import { execute as gradientLUTSetFilterUniformService } from "../service/GradientLUTSetFilterUniformService";
import { execute as gradientLUTGeneratorFillTextureUseCase } from "./GradientLUTGeneratorFillTextureUseCase";
import { $getGradientAttachmentObject } from "../../GradientLUTGenerator";

describe("GradientLUTGenerateFilterTextureUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should generate filter texture", () =>
    {
        const ratios = new Float32Array([0, 255]);
        const colors = new Float32Array([0xFF0000, 0x0000FF]);
        const alphas = new Float32Array([1, 1]);

        const result = execute(ratios, colors, alphas);

        expect($context.bind).toHaveBeenCalled();
        expect(blendOneZeroService).toHaveBeenCalled();
        expect(variantsGradientLUTShaderService).toHaveBeenCalledWith(2, false);
        expect(gradientLUTSetFilterUniformService).toHaveBeenCalled();
        expect(gradientLUTGeneratorFillTextureUseCase).toHaveBeenCalled();
        expect(blendResetService).toHaveBeenCalled();
        expect(result).toEqual({ id: "gradient-texture" });
    });

    it("test case - should handle multiple stops within max length", () =>
    {
        const ratios = new Float32Array([0, 64, 128, 192, 255]);
        const colors = new Float32Array([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0x00FFFF]);
        const alphas = new Float32Array([1, 1, 1, 1, 1]);

        execute(ratios, colors, alphas);

        expect(variantsGradientLUTShaderService).toHaveBeenCalledWith(5, false);
    });

    it("test case - should call blend operations correctly", () =>
    {
        const ratios = new Float32Array([0, 255]);
        const colors = new Float32Array([0xFF0000, 0x0000FF]);
        const alphas = new Float32Array([1, 1]);

        execute(ratios, colors, alphas);

        expect(blendOneZeroService).toHaveBeenCalledTimes(1);
        expect(blendResetService).toHaveBeenCalledTimes(1);
    });
});
