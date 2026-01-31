import { execute } from "./FilterApplyGlowFilterUseCase";
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
    $offset: { x: 0, y: 0 },
    $intToR: vi.fn(() => 1),
    $intToG: vi.fn(() => 0),
    $intToB: vi.fn(() => 0)
}));

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

describe("FilterApplyGlowFilterUseCase.ts method test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("test case - should apply glow filter with default parameters", () =>
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

        const result = execute(mockTextureObject, matrix);

        expect(result).toBeDefined();
        expect(result).toHaveProperty("width");
        expect(result).toHaveProperty("height");
    });

    it("test case - should apply glow filter with custom color", () =>
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

        const result = execute(
            mockTextureObject, matrix,
            0xFF0000,  // color (red)
            1          // alpha
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply glow filter with custom blur values", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 3,
            resource: {} as WebGLTexture,
            width: 256,
            height: 256,
            area: 65536,
            smooth: false
        };

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);

        const result = execute(
            mockTextureObject, matrix,
            0x00FF00,  // color (green)
            0.8,       // alpha
            16,        // blur_x
            16,        // blur_y
            2          // strength
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply inner glow filter", () =>
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

        const result = execute(
            mockTextureObject, matrix,
            0x0000FF,  // color (blue)
            1,
            8, 8, 1, 2,
            true       // inner
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply knockout glow filter", () =>
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

        const result = execute(
            mockTextureObject, matrix,
            0xFFFF00,  // color (yellow)
            1,
            4, 4, 1, 1,
            false,     // inner
            true       // knockout
        );

        expect(result).toBeDefined();
    });

    it("test case - should apply glow filter with high quality", () =>
    {
        const mockTextureObject: ITextureObject = {
            id: 6,
            resource: {} as WebGLTexture,
            width: 512,
            height: 512,
            area: 262144,
            smooth: false
        };

        const matrix = new Float32Array([2, 0, 0, 2, 0, 0]);

        const result = execute(
            mockTextureObject, matrix,
            0xFFFFFF,  // color (white)
            1,
            8, 8,
            3,         // strength
            3          // quality
        );

        expect(result).toBeDefined();
    });
});
