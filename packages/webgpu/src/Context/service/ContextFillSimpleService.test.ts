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

    const createMockUniformBuffer = () =>
    {
        return { "label": "mockUniformBuffer" } as unknown as GPUBuffer;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    describe("bind group", () =>
    {
        it("should request fill bind group layout", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("fill");
        });

        it("should return early when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(console.error).toHaveBeenCalledWith("[WebGPU] Fill bind group layout not found");
            expect(device.createBindGroup).not.toHaveBeenCalled();
        });

        it("should create bind group with uniform buffer", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

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
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill");
        });

        it("should use fill_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, false);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra");
        });

        it("should use fill_bgra_stencil pipeline when useStencilPipeline and not mask drawing", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, false, true);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("fill_bgra_stencil");
        });

        it("should return early when mask drawing mode and useStencilPipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(true);

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, false, true);

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should return early when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

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
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
        });

        it("should set vertex buffer", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, vertexBuffer);
        });

        it("should set bind group", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true);

            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
        });

        it("should draw with correct vertex count", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 24, uniformBuffer, true);

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(24, 1, 0, 0);
        });
    });

    describe("stencil reference", () =>
    {
        it("should set stencil reference for stencil pipeline mode", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
            (($getMaskStencilReference as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(7);

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, false, true);

            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(7);
        });

        it("should not set stencil reference for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer, true, true);

            expect(renderPassEncoder.setStencilReference).not.toHaveBeenCalled();
        });
    });
});
