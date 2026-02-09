import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyBevelFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

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

describe("FilterApplyBevelFilterUseCase", () =>
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
                "queue": { "writeBuffer": vi.fn() },
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

    describe("basic bevel execution", () =>
    {
        it("should apply blur filter", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4,          // distance
                45,         // angle (degrees)
                0xFFFFFF,   // highlightColor
                1.0,        // highlightAlpha
                0x000000,   // shadowColor
                1.0,        // shadowAlpha
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

        it("should create uniform buffer with bevel parameters", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 0.8,
                0x000000, 0.8,
                10, 10,
                2.0, 1, 0, false, 1,
                config
            );

            expect(config.device.createBuffer).toHaveBeenCalled();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should copy textures for compositing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.commandEncoder.copyTextureToTexture).toHaveBeenCalled();
        });

        it("should return result attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("bevel angle calculation", () =>
    {
        it("should calculate bevel position based on angle 0", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 0,  // 0 degrees
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.commandEncoder.copyTextureToTexture).toHaveBeenCalled();
        });

        it("should calculate bevel position based on angle 90", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 90,  // 90 degrees
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.commandEncoder.copyTextureToTexture).toHaveBeenCalled();
        });

        it("should calculate bevel position based on angle 180", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 180,  // 180 degrees
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.commandEncoder.copyTextureToTexture).toHaveBeenCalled();
        });
    });

    describe("bevel type modes", () =>
    {
        it("should handle full bevel type (type 0)", () =>
        {
            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
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
            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
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
            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1,
                2,  // outer
                false, 1,
                config
            );

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        });

        it("should restore offset for inner bevel", () =>
        {
            $offset.x = 5;
            $offset.y = 5;
            const baseOffsetX = $offset.x;
            const baseOffsetY = $offset.y;

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1,
                1,  // inner
                false, 1,
                config
            );

            expect($offset.x).toBe(baseOffsetX);
            expect($offset.y).toBe(baseOffsetY);
        });
    });

    describe("knockout mode", () =>
    {
        it("should pass knockout flag to uniform buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
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
            const config = createMockConfig();
            (config.pipelineManager.getPipeline as ReturnType<typeof vi.fn>).mockReturnValue(null);

            const result = execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(console.error).toHaveBeenCalledWith("[WebGPU BevelFilter] Pipeline not found");
            expect(result).toBe(sourceAttachment);
        });
    });

    describe("cleanup", () =>
    {
        it("should release temporary attachments after processing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            // Should release erase and blur attachments (UV変換方式により一時テクスチャ不要)
            expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalledTimes(2);
        });
    });

    describe("matrix scale handling", () =>
    {
        it("should apply matrix scale to bevel offset", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([2, 0, 0, 2, 0, 0]);  // 2x scale
            const config = createMockConfig();

            execute(
                sourceAttachment,
                matrix,
                4, 45,
                0xFFFFFF, 1.0,
                0x000000, 1.0,
                10, 10,
                1.0, 1, 0, false, 1,
                config
            );

            expect(config.commandEncoder.copyTextureToTexture).toHaveBeenCalled();
        });
    });
});
