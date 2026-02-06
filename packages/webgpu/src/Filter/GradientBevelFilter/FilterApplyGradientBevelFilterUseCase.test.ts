import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyGradientBevelFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x08
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock offset
vi.mock("../index", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

import { $offset } from "../FilterOffset";

// Mock FilterApplyBlurFilterUseCase
vi.mock("../BlurFilter/FilterApplyBlurFilterUseCase", () => ({
    "execute": vi.fn((source: IAttachmentObject) => ({
        ...source,
        "width": source.width + 40,
        "height": source.height + 40
    }))
}));

// Mock GradientLUTGenerator
vi.mock("../../Gradient/GradientLUTGenerator", () => ({
    "generateFilterGradientLUT": vi.fn(() => new Uint8Array(256 * 4))
}));

// Note: FilterGradientLUTCache is no longer used (per-invocation LUT textures instead)

describe("FilterApplyGradientBevelFilterUseCase", () =>
{
    const createMockAttachment = (width: number = 100, height: number = 100): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "texture": {
                "resource": { "label": "mockTexture" } as unknown as GPUTexture,
                "view": { "label": "mockTextureView" } as unknown as GPUTextureView
            }
        } as IAttachmentObject;
    };

    const createMockConfig = (): IFilterConfig =>
    {
        const mockPassEncoder = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };

        return {
            "device": {
                "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
                "createTexture": vi.fn(() => ({
                    "label": "mockLUTTexture",
                    "createView": vi.fn(() => ({ "label": "mockLUTTextureView" }))
                })),
                "queue": {
                    "writeBuffer": vi.fn(),
                    "writeTexture": vi.fn()
                },
                "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
            } as unknown as GPUDevice,
            "commandEncoder": {
                "beginRenderPass": vi.fn(() => mockPassEncoder),
                "copyTextureToTexture": vi.fn()
            } as unknown as GPUCommandEncoder,
            "frameBufferManager": {
                "createTemporaryAttachment": vi.fn((w: number, h: number) => createMockAttachment(w, h)),
                "releaseTemporaryAttachment": vi.fn(),
                "createRenderPassDescriptor": vi.fn(() => ({
                    "colorAttachments": [{ "view": {}, "loadOp": "clear", "storeOp": "store" }]
                }))
            },
            "pipelineManager": {
                "getPipeline": vi.fn(() => ({ "label": "mockPipeline" })),
                "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
            },
            "textureManager": {
                "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
            }
        } as unknown as IFilterConfig;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        $offset.x = 0;
        $offset.y = 0;
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("basic gradient bevel execution", () =>
    {
        it("should apply blur filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0xFFFFFF, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0, 1.0]);
            const ratios = new Float32Array([0, 128, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4,          // distance
                45,         // angle (degrees)
                colors,
                alphas,
                ratios,
                10,         // blurX
                10,         // blurY
                1.0,        // strength
                1,          // quality
                0,          // type (full)
                false,      // knockout
                1,          // devicePixelRatio
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        });

        it("should write gradient LUT to texture", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.device.queue.writeTexture).toHaveBeenCalled();
        });

        it("should create uniform buffer with bevel parameters", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                2.0, 1, 0, false, 1,
                config
            );

            expect(config.device.createBuffer).toHaveBeenCalled();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should use render passes for compositing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            // UV変換方式: bevel_baseパス + 最終合成パス
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should return result attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("bevel type modes", () =>
    {
        it("should handle full bevel type (type 0)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1,
                0,  // full
                false, 1,
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        });

        it("should handle inner bevel type (type 1)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1,
                1,  // inner
                false, 1,
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        });

        it("should handle outer bevel type (type 2)", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1,
                2,  // outer
                false, 1,
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        });
    });

    describe("knockout mode", () =>
    {
        it("should pass knockout flag to uniform buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0,
                true,  // knockout = true
                1,
                config
            );

            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });
    });

    describe("pipeline error handling", () =>
    {
        it("should return source attachment when pipeline not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();
            (config.pipelineManager.getPipeline as ReturnType<typeof vi.fn>).mockReturnValue(null);

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(console.error).toHaveBeenCalledWith("[WebGPU GradientBevelFilter] bevel_base pipeline not found");
            expect(result).toBe(sourceAttachment);
        });
    });

    describe("cleanup", () =>
    {
        it("should release temporary attachments after processing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x0000FF]);
            const alphas = new Float32Array([1.0, 1.0]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            // bevelBaseAttachment + blurAttachment の2つを解放
            expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalledTimes(2);
        });
    });

    describe("gradient colors", () =>
    {
        it("should handle multi-color gradient", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00]);
            const alphas = new Float32Array([1.0, 1.0, 1.0, 1.0]);
            const ratios = new Float32Array([0, 85, 170, 255]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(result).toBeDefined();
        });

        it("should handle gradient with varying alphas", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const colors = new Float32Array([0xFFFFFF, 0x000000]);
            const alphas = new Float32Array([1.0, 0.5]);
            const ratios = new Float32Array([0, 255]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                colors, alphas, ratios,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(result).toBeDefined();
        });
    });
});
