import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../interface/IFilterConfig";
import { execute } from "./BlendApplyComplexBlendUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x0040,
    COPY_DST: 0x0008
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

describe("BlendApplyComplexBlendUseCase", () =>
{
    const createMockAttachment = (width: number, height: number): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": 1,
                "width": width,
                "height": height,
                "area": width * height,
                "smooth": true,
                "resource": {} as GPUTexture,
                "view": { "label": "mockView" } as unknown as GPUTextureView
            },
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };
    };

    const createMockConfig = (hasPipeline: boolean = true): IFilterConfig =>
    {
        const mockBuffer = { "label": "mockBuffer" };
        const mockPassEncoder = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };

        const mockDevice = {
            "createBuffer": vi.fn(() => mockBuffer),
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
            "queue": {
                "writeBuffer": vi.fn()
            }
        } as unknown as GPUDevice;

        const mockCommandEncoder = {
            "beginRenderPass": vi.fn(() => mockPassEncoder)
        } as unknown as GPUCommandEncoder;

        const destAttachment = createMockAttachment(256, 256);

        const mockFrameBufferManager = {
            "createTemporaryAttachment": vi.fn(() => destAttachment),
            "createRenderPassDescriptor": vi.fn(() => ({
                "colorAttachments": [{ "view": destAttachment.texture!.view }]
            }))
        };

        const mockPipelineManager = {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => hasPipeline ? { "label": "mockLayout" } : null)
        };

        const mockTextureManager = {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
        };

        const mockBufferManager = {
            "acquireUniformBuffer": vi.fn(() => mockBuffer),
            "allocateUniformBinding": vi.fn(() => ({ "buffer": mockBuffer, "offset": 256, "size": 48 }))
        };

        return {
            "device": mockDevice,
            "commandEncoder": mockCommandEncoder,
            "frameBufferManager": mockFrameBufferManager,
            "pipelineManager": mockPipelineManager,
            "textureManager": mockTextureManager,
            "bufferManager": mockBufferManager,
            "frameTextures": []
        } as unknown as IFilterConfig;
    };

    beforeEach(() =>
    {
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("output size", () =>
    {
        it("binds multisampled backdrop to its own compatible layout", () =>
        {
            const source = createMockAttachment(81, 63);
            const backdrop = createMockAttachment(800, 600);
            const config = createMockConfig();
            const view = {} as GPUTextureView;
            execute(source, backdrop, "overlay", new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]), config, [3, 5], view);
            expect(config.pipelineManager.getPipeline).toHaveBeenCalledWith("complex_blend_region_msaa");
            expect(config.pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("complex_blend_msaa");
            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(81, 63);
            const entries = Array.from(vi.mocked(config.device.createBindGroup).mock.calls[0][0].entries);
            expect(entries[2].resource).toBe(view);
            expect(entries[3].resource).toBe(source.texture!.view);
        });

        it("reads a region of the full backdrop and keeps the output source-sized", () =>
        {
            const source = createMockAttachment(81, 63);
            const backdrop = createMockAttachment(800, 600);
            const config = createMockConfig();
            const colors = new Float32Array([1, 1, 1, 0.5, 0, 0, 0, 0]);
            execute(source, backdrop, "overlay", colors, config, [799, 598]);
            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(81, 63);
            expect(config.pipelineManager.getPipeline).toHaveBeenCalledWith("complex_blend_region");
            const data = vi.mocked(config.bufferManager!.allocateUniformBinding).mock.calls[0][0];
            expect(Array.from(data.slice(8, 12))).toEqual([4, 799, 598, 0]);
            const entries = Array.from(vi.mocked(config.device.createBindGroup).mock.calls[0][0].entries);
            expect(entries[2].resource).toBe(backdrop.texture!.view);
            execute(source, backdrop, "overlay", colors, config);
            expect(Array.from(data.slice(9, 12))).toEqual([0, 0, 0]);
        });

        it("should use max width of source and destination", () =>
        {
            const srcAttachment = createMockAttachment(200, 256);
            const dstAttachment = createMockAttachment(300, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(
                300, // max(200, 300)
                256
            );
        });

        it("should use max height of source and destination", () =>
        {
            const srcAttachment = createMockAttachment(256, 100);
            const dstAttachment = createMockAttachment(256, 200);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(
                256,
                200 // max(100, 200)
            );
        });
    });

    describe("pipeline selection", () =>
    {
        it("should request pipeline for blend mode", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.pipelineManager.getPipeline).toHaveBeenCalledWith("complex_blend");
        });

        it("should return source when pipeline not found", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig(false);
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            const result = execute(srcAttachment, dstAttachment, "unknown_mode", colorTransform, config);

            expect(console.error).toHaveBeenCalled();
            expect(result).toBe(srcAttachment);
        });
    });

    describe("sampler creation", () =>
    {
        it("should create sampler with smooth setting", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.textureManager.createSampler).toHaveBeenCalledWith("complex_blend_sampler", true);
        });
    });

    describe("uniform buffer", () =>
    {
        it("should create uniform buffer", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.bufferManager.allocateUniformBinding).toHaveBeenCalled();
            expect(config.device.queue.writeBuffer).not.toHaveBeenCalled();
            const entries = vi.mocked(config.device.createBindGroup).mock.calls[0][0].entries;
            expect(Array.from(entries)[0].resource).toEqual({
                "buffer": { "label": "mockBuffer" }, "offset": 256, "size": 48
            });
        });

        it("should write color transform to buffer", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([0.5, 0.6, 0.7, 0.8, 0.1, 0.2, 0.3, 0.4]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.bufferManager.allocateUniformBinding).toHaveBeenCalled();
        });
    });

    describe("bind group", () =>
    {
        it("resets the binding offset for the standalone fallback", () =>
        {
            const source = createMockAttachment(256, 256);
            const target = createMockAttachment(256, 256);
            const colors = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
            execute(source, target, "multiply", colors, createMockConfig());
            const config = createMockConfig();
            const { bufferManager: _manager, ...withoutManager } = config;
            execute(source, target, "multiply", colors, withoutManager as IFilterConfig);
            expect(config.device.queue.writeBuffer).toHaveBeenCalledOnce();
            const entries = vi.mocked(config.device.createBindGroup).mock.calls[0][0].entries;
            expect(Array.from(entries)[0].resource).toEqual({
                "buffer": { "label": "mockBuffer" }, "offset": 0, "size": 48
            });
        });

        it("should request complex_blend bind group layout", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("complex_blend");
        });

        it("should create bind group", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.device.createBindGroup).toHaveBeenCalled();
        });
    });

    describe("render pass", () =>
    {
        it("should create render pass descriptor with clear", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(config.frameBufferManager.createRenderPassDescriptor).toHaveBeenCalledWith(
                expect.anything(),
                0, 0, 0, 0,
                "clear"
            );
        });

        it("should draw 6 vertices (2 triangles)", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            const mockPassEncoder = (config.commandEncoder.beginRenderPass as ReturnType<typeof vi.fn>).mock.results[0].value;
            expect(mockPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });

        it("should end render pass", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            const mockPassEncoder = (config.commandEncoder.beginRenderPass as ReturnType<typeof vi.fn>).mock.results[0].value;
            expect(mockPassEncoder.end).toHaveBeenCalled();
        });
    });

    describe("result", () =>
    {
        it("should return destination attachment", () =>
        {
            const srcAttachment = createMockAttachment(256, 256);
            const dstAttachment = createMockAttachment(256, 256);
            const config = createMockConfig();
            const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

            const result = execute(srcAttachment, dstAttachment, "multiply", colorTransform, config);

            expect(result).not.toBe(srcAttachment);
            expect(result).not.toBe(dstAttachment);
            expect(result.width).toBe(256);
            expect(result.height).toBe(256);
        });
    });
});
