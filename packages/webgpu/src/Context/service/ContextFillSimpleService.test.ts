import { describe, it, expect, vi, beforeEach } from "vitest";
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

    const createMockPipelineManager = (hasPipeline: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
        } as unknown as PipelineManager;
    };

    const createMockVertexBuffer = () =>
    {
        return { "label": "mockVertexBuffer" } as unknown as GPUBuffer;
    };

    const createMockBindGroup = () =>
    {
        return { "label": "mockBindGroup" } as unknown as GPUBindGroup;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    describe("pipeline selection", () =>
    {
        it("should use fill pipeline for atlas target", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill");
        });

        it("should use fill_bgra pipeline for canvas target", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, false);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra");
        });

        it("should use fill_bgra_stencil pipeline when useStencilPipeline and not mask drawing", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, false, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra_stencil");
        });

        it("should return early when mask drawing mode and useStencilPipeline", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(true);

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, false, true);

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should return early when pipeline not found", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(false);
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, true);

            expect(console.error).toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("drawing", () =>
    {
        it("should set pipeline", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, true);

            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
        });

        it("should set vertex buffer", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, true);

            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, vertexBuffer);
        });

        it("should set bind group with dynamic offset", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 256, true);

            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledWith(0, bindGroup, [256]);
        });

        it("should draw with correct vertex count", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 24, bindGroup, 0, true);

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(24, 1, 0, 0);
        });
    });

    describe("stencil reference", () =>
    {
        it("should set stencil reference for stencil pipeline mode", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
            (($getMaskStencilReference as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(7);

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, false, true);

            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(7);
        });

        it("should not set stencil reference for atlas target", () =>
        {
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const bindGroup = createMockBindGroup();

            execute(renderPassEncoder, pipelineManager, vertexBuffer, 12, bindGroup, 0, true, true);

            expect(renderPassEncoder.setStencilReference).not.toHaveBeenCalled();
        });
    });
});
