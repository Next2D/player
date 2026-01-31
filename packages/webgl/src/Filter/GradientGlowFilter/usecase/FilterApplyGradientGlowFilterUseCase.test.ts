import { execute } from "./FilterApplyGradientGlowFilterUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { ITextureObject } from "../../../interface/ITextureObject";

vi.mock("../../BlurFilter/usecase/FilterApplyBlurFilterUseCase", () => ({
    execute: vi.fn(() => ({
        id: 2,
        resource: {},
        width: 120,
        height: 120,
        area: 14400,
        smooth: false
    }))
}));

vi.mock("../../BitmapFilter/usecase/FilterApplyBitmapFilterUseCase", () => ({
    execute: vi.fn(() => ({
        id: 3,
        resource: {},
        width: 130,
        height: 130,
        area: 16900,
        smooth: false
    }))
}));

vi.mock("../../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    execute: vi.fn()
}));

vi.mock("../../../Filter", () => ({
    $offset: { x: 0, y: 0 }
}));

vi.mock("../../../WebGLUtil.ts", async (importOriginal) => {
    const mod = await importOriginal<typeof import("../../../WebGLUtil.ts")>();
    return {
        ...mod,
        $getDevicePixelRatio: vi.fn(() => 1)
    };
});

describe("FilterApplyGradientGlowFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply gradient glow filter with basic parameters", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 1,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colors = new Float32Array([1, 0, 0, 0, 0, 1]);
        const alphas = new Float32Array([1, 1]);
        const ratios = new Float32Array([0, 1]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45,
            colors, alphas, ratios
        );

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply gradient glow filter with custom distance and angle", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 2,
            resource: {} as WebGLTexture,
            width: 200,
            height: 150,
            area: 30000,
            smooth: true
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colors = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        const alphas = new Float32Array([1, 0.5, 1]);
        const ratios = new Float32Array([0, 0.5, 1]);

        const result = execute(
            mockTextureObject, matrix,
            8, 90,
            colors, alphas, ratios
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply inner gradient glow filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colors = new Float32Array([1, 1, 0, 1, 0, 0]);
        const alphas = new Float32Array([1, 1]);
        const ratios = new Float32Array([0, 1]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45,
            colors, alphas, ratios,
            4, 4, 1, 1,
            1           // type = inner
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply outer gradient glow filter", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 4,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colors = new Float32Array([0, 1, 1, 1, 0, 1]);
        const alphas = new Float32Array([1, 1]);
        const ratios = new Float32Array([0, 1]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45,
            colors, alphas, ratios,
            8, 8, 1, 1,
            2           // type = outer
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply full gradient glow filter with knockout", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 5,
            resource: {} as WebGLTexture,
            width: 100,
            height: 100,
            area: 10000,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colors = new Float32Array([1, 1, 1, 0.5, 0.5, 0.5, 0, 0, 0]);
        const alphas = new Float32Array([1, 0.8, 0.6]);
        const ratios = new Float32Array([0, 0.5, 1]);

        const result = execute(
            mockTextureObject, matrix,
            6, 135,
            colors, alphas, ratios,
            12, 12, 2, 2,
            0,          // type = full
            true        // knockout
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply gradient glow filter with high quality", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 6,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const matrix = new Float32Array([2, 0, 0, 2, 0, 0]);
        const colors = new Float32Array([1, 0.5, 0, 0.5, 0, 1]);
        const alphas = new Float32Array([1, 1]);
        const ratios = new Float32Array([0, 1]);

        const result = execute(
            mockTextureObject, matrix,
            4, 45,
            colors, alphas, ratios,
            8, 8,
            3,          // strength
            3           // quality
        );

        expect(result).toBeDefined();
    });
});
