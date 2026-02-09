import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextGradientFillUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock MeshFillGenerateUseCase - now only takes (path_vertices)
vi.mock("../../Mesh/usecase/MeshFillGenerateUseCase", () => ({
    "execute": vi.fn(() => ({
        "buffer": new Float32Array([0, 0, 1, 1, 2, 2]),
        "indexCount": 6
    }))
}));

// Mock GradientLUTGenerator
vi.mock("../../Gradient/GradientLUTGenerator", () => ({
    "generateGradientLUT": vi.fn(() => new Uint8Array(256 * 4)),
    "getAdaptiveResolution": vi.fn(() => 256)
}));

// Mock ContextComputeGradientMatrixService
vi.mock("../service/ContextComputeGradientMatrixService", () => ({
    "execute": vi.fn(() => ({
        "inverseMatrix": new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
        "linearPoints": new Float32Array([0, 0, 1, 0])
    }))
}));

// Mock Mask module
vi.mock("../../Mask", () => ({
    "$isMaskDrawing": vi.fn(() => false),
    "$getMaskStencilReference": vi.fn(() => 5)
}));

// Mock GradientLUTCache
vi.mock("../../Gradient/GradientLUTCache", () => ({
    "$getLUTFromCache": vi.fn(() => null),
    "$putLUTToCache": vi.fn()
}));

// Mock FillTexturePool
const mockFillTexture = {
    "label": "mockFillTexture",
    "createView": vi.fn(() => ({ "label": "mockView" })),
    "destroy": vi.fn()
};
vi.mock("../../FillTexturePool", () => ({
    "$acquireFillTexture": vi.fn(() => mockFillTexture)
}));

import { $isMaskDrawing } from "../../Mask";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";

describe("ContextGradientFillUseCase", () =>
{
    const createMockDevice = () =>
    {
        return {
            "createTexture": vi.fn(),
            "queue": {
                "writeTexture": vi.fn(),
                "writeBuffer": vi.fn()
            },
            "createSampler": vi.fn(() => ({ "label": "mockSampler" })),
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
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" })),
            "createUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" }))
        } as unknown as BufferManager;
    };

    const createMockPipelineManager = (hasPipeline: boolean = true, hasLayout: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipeline ? {
                "label": "mockPipeline",
                "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
            } : null),
            "getBindGroupLayout": vi.fn(() => hasLayout ? { "label": "mockLayout" } : null)
        } as unknown as PipelineManager;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
        (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    describe("basic gradient fill", () =>
    {
        it("should return null when mesh indexCount is 0", () =>
        {
            vi.mocked(meshFillGenerateUseCase).mockReturnValueOnce({
                "buffer": new Float32Array(0),
                "indexCount": 0
            });

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];  // 2 stops

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,  // linear
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0,  // spread: reflect
                0,  // interpolation: RGB
                0,  // focal
                800, 600,
                true
            );

            expect(result).toBe(null);
        });

        it("should call meshFillGenerateUseCase with only path_vertices", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            // meshFillGenerateUseCase now only takes path_vertices
            expect(meshFillGenerateUseCase).toHaveBeenCalledWith(pathVertices);
        });

        it("should return null after drawing (LUT is cached, not returned)", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            // Source always returns null (LUT is cached via $putLUTToCache)
            expect(result).toBe(null);
        });
    });

    describe("atlas target (2-pass stencil)", () =>
    {
        it("should use stencil_write_atlas pipeline for pass 1", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_write_atlas");
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("gradient_fill_stencil_atlas");
        });

        it("should draw twice for atlas target (2-pass)", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(2);
        });
    });

    describe("canvas target (2-pass stencil)", () =>
    {
        it("should use 2-pass stencil fill for canvas without mask", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                false,  // useAtlasTarget
                false   // useStencilPipeline
            );

            // Pass 1: ステンシル書き込み
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_write_main");
            // Pass 2: グラデーション描画
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("gradient_fill_stencil_main");
        });

        it("should draw twice for canvas target (2-pass stencil fill)", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                false,  // useAtlasTarget
                false   // useStencilPipeline
            );

            // 2パス: ステンシル書き込み + グラデーション描画
            expect(renderPassEncoder.draw).toHaveBeenCalledTimes(2);
        });

        it("should use gradient_fill_bgra_stencil_masked pipeline for mask test mode", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                false,  // useAtlasTarget
                true    // useStencilPipeline
            );

            // Pass 1: ステンシル書き込み
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("stencil_write_main");
            // Pass 2: マスクテスト付きグラデーション描画
            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("gradient_fill_bgra_stencil_masked");
        });

        it("should return null when mask drawing and stencil pipeline", () =>
        {
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(true);

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                false,
                true
            );

            expect(result).toBe(null);
        });
    });

    describe("bind group", () =>
    {
        it("should return null when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(result).toBe(null);
            expect(console.error).toHaveBeenCalledWith("[WebGPU] gradient_fill bind group layout not found");
        });
    });

    describe("gradient types", () =>
    {
        it("should pass type parameter to uniform buffer for linear gradient", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,  // linear
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });

        it("should pass type parameter to uniform buffer for radial gradient", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                1,  // radial
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0.5,  // focal = 0.5
                800, 600,
                true
            );

            expect(device.queue.writeBuffer).toHaveBeenCalled();
        });
    });
});
