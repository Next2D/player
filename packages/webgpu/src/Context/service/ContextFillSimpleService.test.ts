import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute } from "./ContextFillSimpleService";

// Mock Mask module
vi.mock("../../Mask", () => ({
    "$isMaskDrawing": vi.fn(() => false),
    "$getMaskStencilReference": vi.fn(() => 5)
}));

import { $isMaskDrawing, $getMaskStencilReference } from "../../Mask";

describe("ContextFillSimpleService", () =>
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
            "setVertexBuffer": vi.fn(),
            "setBindGroup": vi.fn(),
            "setStencilReference": vi.fn(),
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBufferManager = () =>
    {
        const mockBuffer = { "label": "mockUniformBuffer" };
        return {
            "createUniformBuffer": vi.fn(() => mockBuffer),
            "acquireUniformBuffer": vi.fn(() => mockBuffer)
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasPipeline: boolean = true, hasBindGroupLayout: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => hasBindGroupLayout ? { "label": "mockLayout" } : null)
        } as unknown as PipelineManager;
    };

    const createMockVertexBuffer = () =>
    {
        return { "label": "mockVertexBuffer" } as unknown as GPUBuffer;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    describe("uniform buffer creation", () =>
    {
        it("should create uniform buffer with viewport size", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(bufferManager.acquireUniformBuffer).toHaveBeenCalledWith(16); // 4 * sizeof(float)
        });

        it("should write viewport dimensions to uniform buffer", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });
    });

    describe("bind group", () =>
    {
        it("should request fill bind group layout", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("fill");
        });

        it("should return early when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(console.error).toHaveBeenCalledWith("[WebGPU] Fill bind group layout not found");
            expect(device.createBindGroup).not.toHaveBeenCalled();
        });

        it("should create bind group with uniform buffer", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(device.createBindGroup).toHaveBeenCalledWith(
                expect.objectContaining({
                    "entries": expect.arrayContaining([
                        expect.objectContaining({ "binding": 0 })
                    ])
                })
            );
        });
    });

    describe("pipeline selection", () =>
    {
        it("should use fill pipeline for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill");
        });

        it("should use fill_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, false);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra");
        });

        it("should use fill_bgra_stencil pipeline when useStencilPipeline and not mask drawing", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, false, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra_stencil");
        });

        it("should return early when mask drawing mode and useStencilPipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(true);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, false, true);

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should return early when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(console.error).toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("drawing", () =>
    {
        it("should set pipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
        });

        it("should set vertex buffer", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, vertexBuffer);
        });

        it("should set bind group", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true);

            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
        });

        it("should draw with correct vertex count", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 24, 800, 600, true);

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(24, 1, 0, 0);
        });
    });

    describe("stencil reference", () =>
    {
        it("should set stencil reference for stencil pipeline mode", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
            (($getMaskStencilReference as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(7);

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, false, true);

            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(7);
        });

        it("should not set stencil reference for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();

            execute(device, renderPassEncoder, bufferManager, pipelineManager, vertexBuffer, 12, 800, 600, true, true);

            expect(renderPassEncoder.setStencilReference).not.toHaveBeenCalled();
        });
    });
});
