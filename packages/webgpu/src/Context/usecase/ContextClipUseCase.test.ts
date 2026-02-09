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
    "$clipLevels": new Map([[1, 1], [2, 2]])
}));

import { $clipLevels } from "../../Mask";

describe("ContextClipUseCase", () =>
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
            "dynamicUniform": {
                "allocate": vi.fn(() => 0),
                "getBuffer": vi.fn(() => ({ "label": "mockDynamicBuffer" }))
            }
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? {
                "label": "mockPipeline",
                "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
            } : null),
            "getBindGroupLayout": vi.fn(() => ({ "label": "mockDynamicLayout" }))
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
        ($clipLevels as Map<number, number>).clear();
        ($clipLevels as Map<number, number>).set(1, 1);
        ($clipLevels as Map<number, number>).set(2, 2);
    });

    describe("early exit conditions", () =>
    {
        it("should proceed with unknown clip level using fallback", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(999); // Unknown clip level
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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

            // Source no longer checks $clipBounds, uses clipLevel as fallback
            expect(renderPassEncoder.draw).toHaveBeenCalled();
        });

        it("should return early when path vertices is empty", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [];

            execute(
                device,
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
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false);
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(1);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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

            expect(bufferManager.acquireVertexBuffer).toHaveBeenCalled();
            expect(bufferManager.dynamicUniform.allocate).toHaveBeenCalled();
            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, expect.anything());
            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything(), [0]);
            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });

    describe("clip level clamping", () =>
    {
        it("should clamp level to maximum 8 for main attachment", () =>
        {
            // Set up a high level
            ($clipLevels as Map<number, number>).set(10, 10);

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const attachment = createMockAttachment(10);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
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
