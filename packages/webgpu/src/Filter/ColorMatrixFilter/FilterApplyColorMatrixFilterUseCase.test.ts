import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./FilterApplyColorMatrixFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("FilterApplyColorMatrixFilterUseCase", () =>
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

    // Identity color matrix (no change)
    const createIdentityMatrix = (): Float32Array =>
    {
        return new Float32Array([
            1, 0, 0, 0, 0,  // Red row
            0, 1, 0, 0, 0,  // Green row
            0, 0, 1, 0, 0,  // Blue row
            0, 0, 0, 1, 0   // Alpha row
        ]);
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("basic color matrix execution", () =>
    {
        it("should create output attachment with same dimensions", () =>
        {
            const sourceAttachment = createMockAttachment(200, 150);
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(200, 150);
        });

        it("should get color matrix pipeline", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.pipelineManager.getPipeline).toHaveBeenCalledWith("color_matrix_filter");
            expect(config.pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("color_matrix_filter");
        });

        it("should create sampler with linear filtering", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.textureManager.createSampler).toHaveBeenCalledWith("color_matrix_sampler", true);
        });

        it("should create uniform buffer", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.device.createBuffer).toHaveBeenCalled();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should create bind group with correct entries", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.device.createBindGroup).toHaveBeenCalledWith(
                expect.objectContaining({
                    "layout": expect.anything(),
                    "entries": expect.arrayContaining([
                        expect.objectContaining({ "binding": 0 }),
                        expect.objectContaining({ "binding": 1 }),
                        expect.objectContaining({ "binding": 2 })
                    ])
                })
            );
        });

        it("should execute render pass", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            execute(sourceAttachment, matrix, config);

            expect(config.commandEncoder.beginRenderPass).toHaveBeenCalled();
        });

        it("should return destination attachment", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();

            const result = execute(sourceAttachment, matrix, config);

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });

    describe("matrix transformation", () =>
    {
        it("should handle grayscale matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const grayscaleMatrix = new Float32Array([
                0.33, 0.33, 0.33, 0, 0,
                0.33, 0.33, 0.33, 0, 0,
                0.33, 0.33, 0.33, 0, 0,
                0, 0, 0, 1, 0
            ]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, grayscaleMatrix, config);

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should handle invert matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const invertMatrix = new Float32Array([
                -1, 0, 0, 0, 255,
                0, -1, 0, 0, 255,
                0, 0, -1, 0, 255,
                0, 0, 0, 1, 0
            ]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, invertMatrix, config);

            expect(result).toBeDefined();
            expect(config.device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should handle brightness adjustment matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const brightnessMatrix = new Float32Array([
                1, 0, 0, 0, 50,  // Add 50 to red
                0, 1, 0, 0, 50,  // Add 50 to green
                0, 0, 1, 0, 50,  // Add 50 to blue
                0, 0, 0, 1, 0
            ]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, brightnessMatrix, config);

            expect(result).toBeDefined();
        });

        it("should handle saturation matrix", () =>
        {
            const sourceAttachment = createMockAttachment();
            const saturation = 0.5;
            const sr = (1 - saturation) * 0.3086;
            const sg = (1 - saturation) * 0.6094;
            const sb = (1 - saturation) * 0.0820;
            const saturationMatrix = new Float32Array([
                sr + saturation, sg, sb, 0, 0,
                sr, sg + saturation, sb, 0, 0,
                sr, sg, sb + saturation, 0, 0,
                0, 0, 0, 1, 0
            ]);
            const config = createMockConfig();

            const result = execute(sourceAttachment, saturationMatrix, config);

            expect(result).toBeDefined();
        });
    });

    describe("pipeline error handling", () =>
    {
        it("should return source attachment when pipeline not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();
            (config.pipelineManager.getPipeline as ReturnType<typeof vi.fn>).mockReturnValue(null);

            const result = execute(sourceAttachment, matrix, config);

            expect(console.error).toHaveBeenCalledWith("[WebGPU ColorMatrixFilter] Pipeline not found");
            expect(result).toBe(sourceAttachment);
        });

        it("should return source attachment when bind group layout not found", () =>
        {
            const sourceAttachment = createMockAttachment();
            const matrix = createIdentityMatrix();
            const config = createMockConfig();
            (config.pipelineManager.getBindGroupLayout as ReturnType<typeof vi.fn>).mockReturnValue(null);

            const result = execute(sourceAttachment, matrix, config);

            expect(console.error).toHaveBeenCalled();
            expect(result).toBe(sourceAttachment);
        });
    });
});
