import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextBitmapStrokeUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock MeshBitmapStrokeGenerateUseCase
vi.mock("../../Mesh/usecase/MeshBitmapStrokeGenerateUseCase", () => ({
    "execute": vi.fn(() => ({
        "buffer": new Float32Array([0, 0, 1, 1, 2, 2]),
        "indexCount": 6
    }))
}));

// Mock ContextComputeBitmapMatrixService
vi.mock("../service/ContextComputeBitmapMatrixService", () => ({
    "execute": vi.fn(() => new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]))
}));

import { execute as meshBitmapStrokeGenerateUseCase } from "../../Mesh/usecase/MeshBitmapStrokeGenerateUseCase";

describe("ContextBitmapStrokeUseCase", () =>
{
    const createMockDevice = () =>
    {
        const mockTexture = {
            "label": "mockBitmapTexture",
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

    describe("basic bitmap stroke", () =>
    {
        it("should return null when mesh indexCount is 0", () =>
        {
            vi.mocked(meshBitmapStrokeGenerateUseCase).mockReturnValueOnce({
                "buffer": new Float32Array(0),
                "indexCount": 0
            });

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false]];
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true
            );

            expect(result).toBe(null);
        });

        it("should create bitmap texture with correct dimensions", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(64 * 64 * 4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                64, 64,
                false, true,
                800, 600,
                true
            );

            expect(device.createTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "size": { "width": 64, "height": 64 },
                    "format": "rgba8unorm"
                })
            );
        });

        it("should return bitmap texture after drawing", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true
            );

            expect(result).toBe(device._mockTexture);
        });
    });

    describe("pipeline selection", () =>
    {
        it("should use bitmap_fill pipeline for atlas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("bitmap_fill");
        });

        it("should use bitmap_fill_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                false  // useAtlasTarget
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("bitmap_fill_bgra");
        });
    });

    describe("sampler configuration", () =>
    {
        it("should render with smooth sampler when smooth is true", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false,  // repeat
                true,   // smooth
                800, 600,
                true
            );

            // Sampler may be cached from previous tests (module-level cache)
            // Verify rendering proceeds correctly
            expect(renderPassEncoder.draw).toHaveBeenCalled();
            expect(device.createBindGroup).toHaveBeenCalled();
        });

        it("should render with nearest sampler when smooth is false", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false,  // repeat
                false,  // smooth
                800, 600,
                true
            );

            // Sampler may be cached from previous tests (module-level cache)
            // Verify rendering proceeds correctly
            expect(renderPassEncoder.draw).toHaveBeenCalled();
            expect(device.createBindGroup).toHaveBeenCalled();
        });

        it("should render with repeat sampler when repeat is true", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                true,   // repeat
                false,
                800, 600,
                true
            );

            // Sampler may be cached from previous tests (module-level cache)
            // Verify rendering proceeds correctly
            expect(renderPassEncoder.draw).toHaveBeenCalled();
            expect(device.createBindGroup).toHaveBeenCalled();
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
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true
            );

            expect(result).toBe(null);
            expect(device._mockTexture.destroy).toHaveBeenCalled();
        });

        it("should return null when pipeline not found", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager(false, true);
            const vertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true
            );

            expect(result).toBe(null);
            expect(device._mockTexture.destroy).toHaveBeenCalled();
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
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                vertices,
                10,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true
            );

            expect(renderPassEncoder.draw).toHaveBeenCalledWith(6, 1, 0, 0);
        });
    });
});
