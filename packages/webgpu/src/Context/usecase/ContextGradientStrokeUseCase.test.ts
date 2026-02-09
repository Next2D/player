import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextGradientStrokeUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock MeshGradientStrokeGenerateUseCase
vi.mock("../../Mesh/usecase/MeshGradientStrokeGenerateUseCase", () => ({
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

import { execute as meshGradientStrokeGenerateUseCase } from "../../Mesh/usecase/MeshGradientStrokeGenerateUseCase";

describe("ContextGradientStrokeUseCase", () =>
{
    const createMockDevice = () =>
    {
        const mockTexture = {
            "label": "mockLutTexture",
            "createView": vi.fn(() => ({ "label": "mockView" })),
            "destroy": vi.fn()
        };
        return {
            "createTexture": vi.fn(() => mockTexture),
            "queue": {
                "writeTexture": vi.fn(),
                "writeBuffer": vi.fn()
            },
            "createSampler": vi.fn(() => ({ "label": "mockSampler" })),
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" })),
            "_mockTexture": mockTexture
        } as unknown as GPUDevice & { _mockTexture: any };
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
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "createUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" })),
            "acquireVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" }))
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

    describe("basic gradient stroke", () =>
    {
        it("should return null when mesh indexCount is 0", () =>
        {
            vi.mocked(meshGradientStrokeGenerateUseCase).mockReturnValueOnce({
                "buffer": new Float32Array(0),
                "indexCount": 0
            });

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,  // linear
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(result).toBe(null);
        });

        it("should create LUT texture", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 256, "height": 1 },
                    "format": "rgba8unorm"
                })
            );
        });

        it("should return LUT texture after drawing", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(result).toBe(device._mockTexture);
        });
    });

    describe("pipeline selection", () =>
    {
        it("should use gradient_fill pipeline for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("gradient_fill");
        });

        it("should use gradient_fill_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                false  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("gradient_fill_bgra");
        });
    });

    describe("error handling", () =>
    {
        it("should return null when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(true, false);
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
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
            expect(device._mockTexture.destroy).not.toHaveBeenCalled();
        });

        it("should return null when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
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
            expect(device._mockTexture.destroy).not.toHaveBeenCalled();
        });
    });

    describe("drawing", () =>
    {
        it("should draw with correct vertex count", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const stops = [0, 1, 0, 0, 1, 1, 0, 1, 0, 1];

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                0,
                stops,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                0, 0, 0,
                800, 600,
                true
            );

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });
});
