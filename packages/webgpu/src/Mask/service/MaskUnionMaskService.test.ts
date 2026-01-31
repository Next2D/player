import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import { execute } from "./MaskUnionMaskService";

describe("MaskUnionMaskService", () =>
{
    const createMockRenderPassEncoder = () =>
    {
        return {
            "setPipeline": vi.fn(),
            "setStencilReference": vi.fn(),
            "setVertexBuffer": vi.fn(),
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBufferManager = () =>
    {
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" }))
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasMergePipeline: boolean = true, hasClearPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn((name: string) => {
                if (name.startsWith("mask_union_merge_") && hasMergePipeline) {
                    return { "label": `mock_${name}` };
                }
                if (name.startsWith("mask_union_clear_") && hasClearPipeline) {
                    return { "label": `mock_${name}` };
                }
                return null;
            })
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
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment();

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            expect(bufferManager.acquireVertexBuffer).toHaveBeenCalled();
            const callArgs = (bufferManager.acquireVertexBuffer as ReturnType<typeof vi.fn>).mock.calls[0];
            // Check vertex data size (Float32Array with 6 vertices * 17 floats each = 102 floats = 408 bytes)
            expect(callArgs[0]).toBe(408);
            const vertexData = callArgs[1] as Float32Array;
            expect(vertexData.length).toBe(102);
        });
    });

    describe("two-pass operation", () =>
    {
        it("should execute merge pass first then clear pass", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(3);

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Should request both pipelines
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("mask_union_merge_3");
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("mask_union_clear_3");

            // Should draw twice (merge + clear)
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(2);
            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });

        it("should set correct stencil references for merge pass", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(3);

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // mask = 1 << (clipLevel - 1) = 1 << 2 = 4
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(4);
            // clear pass uses 0
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
        });

        it("should calculate correct mask for different clip levels", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(5);

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // mask = 1 << (5 - 1) = 1 << 4 = 16
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(16);
        });
    });

    describe("pipeline not found", () =>
    {
        it("should skip merge pass when merge pipeline not found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const attachment = createMockAttachment();

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Only clear pass should be executed
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(1);
        });

        it("should skip clear pass when clear pipeline not found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const attachment = createMockAttachment();

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // Only merge pass should be executed
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(1);
        });

        it("should skip both passes when no pipelines found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, false);
            const attachment = createMockAttachment();

            execute(renderPassEncoder, bufferManager, pipelineManager, attachment);

            // No drawing should occur
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("null attachment", () =>
    {
        it("should return early when attachment is null", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();

            execute(renderPassEncoder, bufferManager, pipelineManager, null as unknown as IAttachmentObject);

            expect(bufferManager.acquireVertexBuffer).not.toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });
});
