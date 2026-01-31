import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextStrokeUseCase";

// Mock the MeshStrokeGenerateUseCase
vi.mock("../../Mesh/usecase/MeshStrokeGenerateUseCase", () => ({
    "generateStrokeMesh": vi.fn((vertices: IPath[], _thickness: number) => {
        if (!vertices || vertices.length === 0) {
            return new Float32Array(0);
        }
        // 8 floats (2 quads with 4 floats each)
        return new Float32Array([0, 0, 0.5, 0.5, 1, 0, 0.5, 0.5]);
    })
}));

describe("ContextStrokeUseCase", () =>
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
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBufferManager = () =>
    {
        const mockBuffer = { "label": "mockBuffer" };
        return {
            "createVertexBuffer": vi.fn(() => mockBuffer),
            "createUniformBuffer": vi.fn(() => mockBuffer)
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasPipeline: boolean = true, hasLayout: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => hasLayout ? { "label": "mockLayout" } : null)
        } as unknown as PipelineManager;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("basic execution", () =>
    {
        it("should return early for empty vertices", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                [],  // empty vertices
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should create vertex buffer for stroke", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(bufferManager.createVertexBuffer).toHaveBeenCalled();
        });

        it("should create uniform buffer with matrix and color data", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            // Uniform buffer: 20 floats = 80 bytes
            expect(bufferManager.createUniformBuffer).toHaveBeenCalledWith(
                expect.stringContaining("stroke_uniform_"),
                80
            );
        });
    });

    describe("bind group creation", () =>
    {
        it("should request basic bind group layout", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(pipelineManager.getBindGroupLayout).toHaveBeenCalledWith("basic");
        });

        it("should return early when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(console.error).toHaveBeenCalledWith("[WebGPU] Basic bind group layout not found");
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("pipeline selection", () =>
    {
        it("should use basic pipeline for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("basic");
        });

        it("should use basic_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                false  // useAtlasTarget = false
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("basic_bgra");
        });

        it("should return early when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(console.error).toHaveBeenCalled();
            expect(renderPassEncoder.draw).not.toHaveBeenCalled();
        });
    });

    describe("drawing", () =>
    {
        it("should set pipeline and draw", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 0, 0, 1]),
                1,
                800, 600,
                true
            );

            expect(renderPassEncoder.setPipeline).toHaveBeenCalled();
            expect(renderPassEncoder.setVertexBuffer).toHaveBeenCalledWith(0, expect.anything());
            expect(renderPassEncoder.setBindGroup).toHaveBeenCalledWith(0, expect.anything());
            expect(renderPassEncoder.draw).toHaveBeenCalledWith(2, 1, 0, 0); // 8 floats / 4 = 2 vertices
        });
    });
});
