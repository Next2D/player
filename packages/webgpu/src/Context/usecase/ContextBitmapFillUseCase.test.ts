import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BufferManager } from "../../BufferManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { IPath } from "../../interface/IPath";
import { execute } from "./ContextBitmapFillUseCase";

// Mock GPUTextureUsage
const GPUTextureUsage = {
    TEXTURE_BINDING: 0x04,
    COPY_DST: 0x02
};
(globalThis as any).GPUTextureUsage = GPUTextureUsage;

// Mock MeshFillGenerateUseCase
vi.mock("../../Mesh/usecase/MeshFillGenerateUseCase", () => ({
    "execute": vi.fn(() => ({
        "buffer": new Float32Array([0, 0, 1, 1, 2, 2]),
        "indexCount": 6
    }))
}));

// Mock ContextComputeBitmapMatrixService
vi.mock("../service/ContextComputeBitmapMatrixService", () => ({
    "execute": vi.fn(() => new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]))
}));

// Mock Mask module
vi.mock("../../Mask", () => ({
    "$isMaskDrawing": vi.fn(() => false),
    "$getMaskStencilReference": vi.fn(() => 5)
}));

import { $isMaskDrawing } from "../../Mask";
import { execute as meshFillGenerateUseCase } from "../../Mesh/usecase/MeshFillGenerateUseCase";

describe("ContextBitmapFillUseCase", () =>
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
            "setStencilReference": vi.fn(),
            "draw": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockBufferManager = () =>
    {
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "createUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" }))
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
        (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(false);
    });

    describe("basic bitmap fill", () =>
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
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
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
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(64 * 64 * 4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                64, 64,  // width, height
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
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
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
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                true,   // useAtlasTarget
                false   // useStencilPipeline
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("bitmap_fill");
        });

        it("should use bitmap_fill_bgra pipeline for canvas target", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                false,  // useAtlasTarget
                false   // useStencilPipeline
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("bitmap_fill_bgra");
        });

        it("should return null when mask drawing and stencil pipeline", () =>
        {
            (($isMaskDrawing as unknown) as ReturnType<typeof vi.fn>).mockReturnValue(true);

            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                false, true,
                800, 600,
                false,  // useAtlasTarget
                true    // useStencilPipeline
            );

            expect(result).toBe(null);
            expect(device._mockTexture.destroy).toHaveBeenCalled();
        });
    });

    describe("sampler configuration", () =>
    {
        it("should create sampler with linear filter when smooth is true", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
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

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "magFilter": "linear",
                    "minFilter": "linear"
                })
            );
        });

        it("should create sampler with repeat address mode when repeat is true", () =>
        {
            const device = createMockDevice();
            const renderPassEncoder = createMockRenderPassEncoder();
            const bufferManager = createMockBufferManager();
            const pipelineManager = createMockPipelineManager();
            const pathVertices: IPath[] = [[0, 0, false, 100, 0, false]];
            const pixels = new Uint8Array(4);

            execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
                new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
                new Float32Array([1, 1, 1, 1]),
                pixels,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                1, 1,
                true,   // repeat
                false,  // smooth
                800, 600,
                true
            );

            expect(device.createSampler).toHaveBeenCalledWith(
                expect.objectContaining({
                    "addressModeU": "repeat",
                    "addressModeV": "repeat"
                })
            );
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
            const pixels = new Uint8Array(4);

            const result = execute(
                device,
                renderPassEncoder,
                bufferManager,
                pipelineManager,
                pathVertices,
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
            expect(console.error).toHaveBeenCalledWith("[WebGPU] bitmap_fill bind group layout not found");
        });
    });
});
