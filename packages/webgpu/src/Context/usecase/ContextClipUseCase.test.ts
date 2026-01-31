import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextClipUseCase";

// Mock modules
vi.mock("../../Mesh/usecase/MeshFillGenerateUseCase", () => ({
    "execute": vi.fn(() => ({
        "buffer": new Float32Array([0, 0, 1, 1, 2, 2]),
        "indexCount": 6
    }))
}));

vi.mock("../../Mask/service/MaskUnionMaskService", () => ({
    "execute": vi.fn()
}));

vi.mock("../../Mask", () => ({
    "$clipBounds": new Map([
        [1, [0, 0, 100, 100]],
        [2, [50, 50, 200, 200]]
    ]),
    "$clipLevels": new Map([[1, 1], [2, 2]])
}));

vi.mock("../../Debug/DebugLogger", () => ({
    "isDebugEnabled": vi.fn(() => false),
    "logMask": vi.fn()
}));

import { $clipBounds, $clipLevels } from "../../Mask";

describe("ContextClipUseCase", () =>
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
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" }))
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null)
        } as unknown as PipelineManager;
    };

    const createMockAttachment = (clipLevel: number = 1): IAttachmentObject =>
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
        vi.spyOn(console, "error").mockImplementation(() => {});
        // Reset mocked Maps to initial state
        ($clipBounds as Map<number, number[]>).clear();
        ($clipBounds as Map<number, number[]>).set(1, [0, 0, 100, 100]);
        ($clipBounds as Map<number, number[]>).set(2, [50, 50, 200, 200]);
        ($clipLevels as Map<number, number>).clear();
        ($clipLevels as Map<number, number>).set(1, 1);
        ($clipLevels as Map<number, number>).set(2, 2);
    });

    describe("early exit conditions", () =>
    {
        it("should return early when clip bounds not found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(999); // Unknown clip level
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                false
            );

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should return early when path vertices is empty", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                false
            );

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("pipeline selection", () =>
    {
        it("should use clip_write pipeline for atlas attachment", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                false  // isMainAttachment = false
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("clip_write");
        });

        it("should use clip_write_main_N pipeline for main attachment", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                true  // isMainAttachment = true
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("clip_write_main_1");
        });

        it("should return early when pipeline not found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false);
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                false
            );

            expect(console.error).toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("drawing", () =>
    {
        it("should create vertex buffer and draw", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                false
            );

            expect(bufferManager.createVertexBuffer).toHaveBeenCalled();
            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, expect.anything());
            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });

    describe("clip level clamping", () =>
    {
        it("should clamp level to maximum 8 for main attachment", () =>
        {
            // Set up a high level
            ($clipBounds as Map<number, number[]>).set(10, [0, 0, 100, 100]);

            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(10);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                attachment,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,
                true
            );

            // Level 10 should be clamped to 8
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("clip_write_main_8");
        });
    });
});
