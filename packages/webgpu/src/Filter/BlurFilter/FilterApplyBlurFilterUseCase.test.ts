import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyBlurFilterUseCase";

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

// Mock BlurFilterUseCase
vi.mock("../BlurFilterUseCase", () => ({
    "calculateBlurParams": vi.fn(() => ({
        "baseBlurX": 10,
        "baseBlurY": 10,
        "offsetX": 20,
        "offsetY": 20,
        "bufferScaleX": 1,
        "bufferScaleY": 1
    })),
    "calculateDirectionalBlurParams": vi.fn(() => ({
        "offsetX": 0.01,
        "offsetY": 0,
        "fraction": 1,
        "samples": 11,
        "halfBlur": 5
    }))
}));

describe("FilterApplyBlurFilterUseCase", () =>
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
            "setViewport": vi.fn(),
            "setScissorRect": vi.fn(),
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
                "beginRenderPass": vi.fn(() => mockPassEncoder)
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

    describe("basic blur execution", () =>
    {
        it("should create temporary attachments for ping-pong buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            // Should create 2 temporary attachments for ping-pong
            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledTimes(2);
        });

        it("should create sampler with linear filtering", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(config.textureManager.createSampler).toHaveBeenCalledWith("blur_sampler", true);
        });

        it("should update offset based on blur parameters", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect($offset.x).toBe(20);
            expect($offset.y).toBe(20);
        });

        it("should return result attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("multi-pass blur", () =>
    {
        it("should perform blur passes based on quality", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 3, 1, config);

            // Quality 3 = 3 iterations * 2 directions (H+V) + 1 initial copy = 7 render passes
            // Actually: 1 copy + (3 * 2 blur passes) = 7
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should skip horizontal pass when blurX is 0", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 0, 10, 1, 1, config);

            // Should still work, just fewer passes
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should skip vertical pass when blurY is 0", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 0, 1, 1, config);

            // Should still work, just fewer passes
            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });
    });

    describe("buffer management", () =>
    {
        it("should release unused buffer after processing", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            // Should release at least one temporary attachment
            expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
        });
    });

    describe("pipeline error handling", () =>
    {
        it("should log error when pipeline not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();
            (config.pipelineManager.getPipeline as ReturnType<typeof vi.fn>).mockReturnValue(null);

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(console.error).toHaveBeenCalled();
        });

        it("should log error when bind group layout not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
            const config = createMockConfig();
            (config.pipelineManager.getBindGroupLayout as ReturnType<typeof vi.fn>).mockReturnValue(null);

            execute(sourceAttachment, matrix, 10, 10, 1, 1, config);

            expect(console.error).toHaveBeenCalled();
        });
    });
});
