import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./MaskUnionMaskService";

describe("MaskUnionMaskService", () =>
{
    const createMockDevice = () =>
    {
        return {
            "queue": {
                "writeBuffer": vi.fn()
            },
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
        } as unknown as GPUDevice;
    };

    const createMockRenderPassEncoder = () =>
    {
        return {
            "setPipeline": vi.fn(),
            "setStencilReference": vi.fn(),
            "setVertexBuffer": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBufferManager = () =>
    {
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" })),
            "acquireAndWriteUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" })),
            "dynamicUniform": {
                "allocate": vi.fn(() => 0),
                "getBuffer": vi.fn(() => ({ "label": "mockDynamicBuffer" }))
            }
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasMergePipeline: boolean = true, hasClearPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn((name: string) => {
                if (name.startsWith("mask_union_merge_") && hasMergePipeline) {
                    return {
                        "label": `mock_${name}`,
                        "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
                    };
                }
                if (name.startsWith("mask_union_clear_") && hasClearPipeline) {
                    return {
                        "label": `mock_${name}`,
                        "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
                    };
                }
                return null;
            }),
            "getBindGroupLayout": vi.fn(() => ({ "label": "mockDynamicLayout" }))
        } as unknown as PipelineManager;
    };

    const createMockAttachment = (clipLevel: number = 3): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": 800,
            "height": 600,
            "clipLevel": clipLevel,
            "texture": {
                "resource": { "label": "mockTexture" } as unknown as GPUTexture,
                "view": { "label": "mockTextureView" } as unknown as GPUTextureView
            },
            "stencil": {
                "resource": { "label": "mockStencil" } as unknown as GPUTexture,
                "view": { "label": "mockStencilView" } as unknown as GPUTextureView
            }
        };
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("vertex buffer creation", () =>
    {
        it("should create vertex buffer with fullscreen rectangle data", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            expect(bufferManager.acquireVertexBuffer).toHaveBeenCalled();
            const callArgs = (bufferManager.acquireVertexBuffer as ReturnType<typeof vi.fn>).mock.calls[0];
            // Check vertex data size (Float32Array with 6 vertices * 4 floats each = 24 floats = 96 bytes)
            expect(callArgs[0]).toBe(96);
            const vertexData = callArgs[1] as Float32Array;
            expect(vertexData.length).toBe(24);
        });
    });

    describe("uniform buffer creation", () =>
    {
        it("should allocate uniform data via dynamic uniform allocator", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            expect(bufferManager.dynamicUniform.allocate).toHaveBeenCalled();
        });
    });

    describe("two-pass operation", () =>
    {
        it("should execute merge pass first then clear pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(3);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Should request both pipelines
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("mask_union_merge_3");
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("mask_union_clear_3");

            // Should draw twice (merge + clear)
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(2);
            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });

        it("should set correct stencil references for merge pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(3);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // mask = 1 << (clipLevel - 1) = 1 << 2 = 4
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(4);
            // clear pass uses 0
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
        });

        it("should calculate correct mask for different clip levels", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(5);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // mask = 1 << (5 - 1) = 1 << 4 = 16
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(16);
        });

        it("should set bind groups for both passes", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(3);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledTimes(2);
            // 1 createBindGroup for dynamic bind group (shared by both passes)
            expect(device.createBindGroup).toHaveBeenCalledTimes(1);
        });
    });

    describe("pipeline not found", () =>
    {
        it("should skip merge pass when merge pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const attachment = createMockAttachment();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Only clear pass should be executed
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(1);
        });

        it("should skip clear pass when clear pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const attachment = createMockAttachment();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Only merge pass should be executed
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(1);
        });

        it("should skip both passes when no pipelines found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, false);
            const attachment = createMockAttachment();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, attachment);

            // No drawing should occur
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("null attachment", () =>
    {
        it("should return early when attachment is null", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, null as unknown as IAttachmentObject);

            expect(bufferManager.acquireVertexBuffer).not.toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });
});
