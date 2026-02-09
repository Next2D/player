import { describe, it, expect, vi, beforeEach } from "vitest";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute } from "./ContextFillWithStencilService";

describe("ContextFillWithStencilService", () =>
{
    const createMockDevice = () =>
    {
        return {
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
            "queue": {
                "writeBuffer": vi.fn()
            }
        } as unknown as GPUDevice;
    };

    const createMockRenderPassEncoder = () =>
    {
        return {
            "setPipeline": vi.fn(),
            "setVertexBuffer": vi.fn(),
            "setStencilReference": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockPipelineManager = (
        hasStencilWrite: boolean = true,
        hasStencilFill: boolean = true
    ) =>
    {
        return {
            "getPipeline": vi.fn((name: string) => {
                if (name === "stencil_write_atlas" && hasStencilWrite) {
                    return {
                        "label": "stencil_write_atlas",
                        "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
                    };
                }
                if (name === "stencil_fill_atlas" && hasStencilFill) {
                    return {
                        "label": "stencil_fill_atlas",
                        "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
                    };
                }
                return null;
            })
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
    });

    describe("pass 1: stencil write", () =>
    {
        it("should get stencil_write_atlas pipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_write_atlas");
        });

        it("should set stencil write pipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            // First call should be stencil_write_atlas
            const setPipelineCalls = (renderPassEncoder.setPipeline as ReturnType<typeof vi.fn>).mock.calls;
            expect(setPipelineCalls[0][0]).toHaveProperty("label", "stencil_write_atlas");
        });

        it("should set stencil reference to 0 for write pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
        });

        it("should set vertex buffer for write pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, vertexBuffer);
        });

        it("should draw with correct vertex count for write pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 24, uniformBuffer);

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(24, 1, 0, 0);
        });

        it("should skip write pass when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            // setPipeline should only be called once (for fill pass)
            expect(renderPassEncoder.setPipeline).toHaveBeenCalledTimes(1);
        });
    });

    describe("pass 2: stencil fill", () =>
    {
        it("should get stencil_fill_atlas pipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_fill_atlas");
        });

        it("should set stencil fill pipeline", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            const setPipelineCalls = (renderPassEncoder.setPipeline as ReturnType<typeof vi.fn>).mock.calls;
            expect(setPipelineCalls[1][0]).toHaveProperty("label", "stencil_fill_atlas");
        });

        it("should set stencil reference to 0 for fill pass", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            // Both passes set stencil reference to 0
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledWith(0);
            expect(renderPassEncoder.setStencilReference).toHaveBeenCalledTimes(2);
        });

        it("should skip fill pass when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            // setPipeline should only be called once (for write pass)
            expect(renderPassEncoder.setPipeline).toHaveBeenCalledTimes(1);
        });
    });

    describe("both passes", () =>
    {
        it("should execute both passes in order", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(pipelineManager.getPipeline).toHaveBeenCalledTimes(2);
            expect(renderPassEncoder.setPipeline).toHaveBeenCalledTimes(2);
            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledTimes(1);
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(2);
        });

        it("should draw same vertex count for both passes", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 36, uniformBuffer);

            const drawCalls = (renderPassEncoder.draw as ReturnType<typeof vi.fn>).mock.calls;
            expect(drawCalls[0][0]).toBe(36);
            expect(drawCalls[1][0]).toBe(36);
        });
    });

    describe("edge cases", () =>
    {
        it("should handle zero vertex count", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager();
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 0, uniformBuffer);

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(0, 1, 0, 0);
        });

        it("should continue when only one pipeline exists", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            // Only write pass executed
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(1);
        });

        it("should do nothing when no pipelines exist", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const pipelineManager = createMockPipelineManager(false, false);
            const vertexBuffer = createMockVertexBuffer();
            const uniformBuffer = createMockUniformBuffer();

            execute(device, renderPassEncoder, pipelineManager, vertexBuffer, 12, uniformBuffer);

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });
});
