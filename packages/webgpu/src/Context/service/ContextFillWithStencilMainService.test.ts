import { execute } from "./ContextFillWithStencilMainService";
import { describe, expect, it, vi } from "vitest";

describe("ContextFillWithStencilMainService.js test", () => {

    const createMockRenderPassEncoder = () => ({
        "setPipeline": vi.fn(),
        "setVertexBuffer": vi.fn(),
        "setStencilReference": vi.fn(),
        "setBindGroup": vi.fn(),
        "draw": vi.fn()
    }) as unknown as GPURenderPassEncoder;

    const createMockPipelineManager = (hasWrite = true, hasFill = true) => ({
        "getPipeline": vi.fn((name: string) => {
            if (name === "stencil_write_main" && hasWrite) {
                return { "label": "stencil_write_main" };
            }
            if (name === "stencil_fill_main" && hasFill) {
                return { "label": "stencil_fill_main" };
            }
            return null;
        })
    }) as any;

    it("execute test case1 - stencil write pass", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager();
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 12, bindGroup, 0);

        expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_write_main");
        expect(encoder.setStencilReference).toHaveBeenCalledWith(0);
        expect(encoder.setVertexBuffer).toHaveBeenCalledWith(0, vertexBuffer);
    });

    it("execute test case2 - stencil fill pass", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager();
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 12, bindGroup, 0);

        expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_fill_main");
    });

    it("execute test case3 - both passes execute in order", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager();
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 12, bindGroup, 0);

        expect(pipelineManager.getPipeline).toHaveBeenCalledTimes(2);
        expect(encoder.setPipeline).toHaveBeenCalledTimes(2);
        expect(encoder.draw).toHaveBeenCalledTimes(2);
        expect(encoder.draw).toHaveBeenCalledWith(12, 1, 0, 0);
    });

    it("execute test case4 - bind group with dynamic offset", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager();
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 6, bindGroup, 256);

        expect(encoder.setBindGroup).toHaveBeenCalledWith(0, bindGroup, [256]);
    });

    it("execute test case5 - no write pipeline available", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager(false, true);
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 12, bindGroup, 0);

        // write pass skipped, but fill pass should still execute
        expect(encoder.draw).toHaveBeenCalledTimes(1);
    });

    it("execute test case6 - no pipelines available", () =>
    {
        const encoder = createMockRenderPassEncoder();
        const pipelineManager = createMockPipelineManager(false, false);
        const vertexBuffer = {} as unknown as GPUBuffer;
        const bindGroup = {} as unknown as GPUBindGroup;

        execute(encoder, pipelineManager, vertexBuffer, 12, bindGroup, 0);

        expect(encoder.draw).not.toHaveBeenCalled();
    });
});
