import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute } from "./ContextDrawIndirectUseCase";

// Mock modules
vi.mock("../../Blend/BlendInstancedManager", () => ({
    "getInstancedShaderManager": vi.fn(() => ({
        "count": 10,
        "clear": vi.fn()
    }))
}));

vi.mock("../../Blend", () => ({
    "$getCurrentBlendMode": vi.fn(() => "normal")
}));

vi.mock("@next2d/render-queue", () => ({
    "renderQueue": {
        "buffer": new Float32Array(100),
        "offset": 50
    }
}));

vi.mock("../../Mask", () => ({
    "$isMaskTestEnabled": vi.fn(() => false),
    "$getMaskStencilReference": vi.fn(() => 0)
}));

import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { $getCurrentBlendMode } from "../../Blend";

describe("ContextDrawIndirectUseCase", () =>
{
    const createMockDevice = () =>
    {
        return {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" })),
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
        } as unknown as GPUDevice;
    };

    const createMockCommandEncoder = () =>
    {
        const mockPassEncoder = {
            "setPipeline": vi.fn(),
            "setStencilReference": vi.fn(),
            "setVertexBuffer": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn(),
            "drawIndirect": vi.fn(),
            "end": vi.fn()
        };
        return {
            "beginRenderPass": vi.fn(() => mockPassEncoder),
            "_mockPassEncoder": mockPassEncoder
        } as unknown as GPUCommandEncoder & { _mockPassEncoder: any };
    };

    const createMockRenderPassEncoder = () =>
    {
        return {
            "end": vi.fn()
        } as unknown as GPURenderPassEncoder;
    };

    const createMockAttachment = (): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": 800,
            "height": 600,
            "texture": {
                "resource": { "label": "mockTexture" } as unknown as GPUTexture,
                "view": { "label": "mockTextureView" } as unknown as GPUTextureView
            },
            "stencil": {
                "resource": { "label": "mockStencil" } as unknown as GPUTexture,
                "view": { "label": "mockStencilView" } as unknown as GPUTextureView
            }
        };
    };

    const createMockBufferManager = () =>
    {
        return {
            "createVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "acquireVertexBuffer": vi.fn(() => ({ "label": "mockVertexBuffer" })),
            "createRectVertices": vi.fn(() => new Float32Array([0, 0, 1, 0, 1, 1, 0, 1])),
            "acquireStorageBuffer": vi.fn(() => ({ "label": "mockStorageBuffer" })),
            "writeStorageBuffer": vi.fn(),
            "createIndirectBuffer": vi.fn(() => ({ "label": "mockIndirectBuffer" }))
        } as unknown as BufferManager;
    };

    const createMockFrameBufferManager = () =>
    {
        return {
            "createRenderPassDescriptor": vi.fn(() => ({ "label": "mockDescriptor" })),
            "createStencilRenderPassDescriptor": vi.fn(() => ({ "label": "mockStencilDescriptor" })),
            "getAttachment": vi.fn(() => ({
                "texture": {
                    "resource": { "label": "atlasTexture" },
                    "view": { "label": "atlasTextureView" }
                }
            }))
        } as unknown as FrameBufferManager;
    };

    const createMockTextureManager = () =>
    {
        return {} as unknown as TextureManager;
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
        (getInstancedShaderManager as ReturnType<typeof vi.fn>).mockReturnValue({
            "count": 10,
            "clear": vi.fn()
        });
        ($getCurrentBlendMode as ReturnType<typeof vi.fn>).mockReturnValue("normal");
    });

    describe("early exit conditions", () =>
    {
        it("should return render pass encoder when count is 0", () =>
        {
            (getInstancedShaderManager as ReturnType<typeof vi.fn>).mockReturnValue({
                "count": 0,
                "clear": vi.fn()
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const renderPassEncoder = createMockRenderPassEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const result = execute(
                device,
                commandEncoder,
                renderPassEncoder,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager
            );

            expect(result).toBe(renderPassEncoder);
            expect(commandEncoder.beginRenderPass).not.toHaveBeenCalled();
        });
    });

    describe("storage buffer handling", () =>
    {
        it("should use storage buffer when useStorageBuffer is true (default)", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager,
                true,  // useIndirect
                true   // useStorageBuffer (default)
            );

            expect(bufferManager.acquireStorageBuffer).toHaveBeenCalled();
            expect(bufferManager.writeStorageBuffer).toHaveBeenCalled();
        });

        it("should use vertex buffer when useStorageBuffer is false", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager,
                true,   // useIndirect
                false   // useStorageBuffer
            );

            expect(bufferManager.acquireStorageBuffer).not.toHaveBeenCalled();
            // acquireVertexBufferはサイズとデータを引数に取る
            expect(bufferManager.acquireVertexBuffer).toHaveBeenCalled();
        });
    });

    describe("indirect drawing", () =>
    {
        it("should use drawIndirect when useIndirect is true (default)", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager,
                true,  // useIndirect (default)
                true
            );

            expect(bufferManager.createIndirectBuffer).toHaveBeenCalledWith(6, 10, 0, 0);
            expect(commandEncoder._mockPassEncoder.drawIndirect).toHaveBeenCalled();
            expect(commandEncoder._mockPassEncoder.draw).not.toHaveBeenCalled();
        });

        it("should use regular draw when useIndirect is false", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager,
                false,  // useIndirect
                true
            );

            expect(bufferManager.createIndirectBuffer).not.toHaveBeenCalled();
            expect(commandEncoder._mockPassEncoder.draw).toHaveBeenCalledWith(6, 10, 0, 0);
            expect(commandEncoder._mockPassEncoder.drawIndirect).not.toHaveBeenCalled();
        });
    });

    describe("blend mode pipeline selection", () =>
    {
        const blendModes = [
            { "mode": "add", "expected": "instanced_add" },
            { "mode": "screen", "expected": "instanced_screen" },
            { "mode": "alpha", "expected": "instanced_alpha" },
            { "mode": "erase", "expected": "instanced_erase" },
            { "mode": "copy", "expected": "instanced_copy" },
            { "mode": "layer", "expected": "instanced_copy" },
            { "mode": "normal", "expected": "instanced_normal" }
        ];

        blendModes.forEach(({ mode, expected }) =>
        {
            it(`should use ${expected} pipeline for ${mode} blend mode`, () =>
            {
                ($getCurrentBlendMode as ReturnType<typeof vi.fn>).mockReturnValue(mode);

                const device = createMockDevice();
                const commandEncoder = createMockCommandEncoder();
                const attachment = createMockAttachment();
                const bufferManager = createMockBufferManager();
                const frameBufferManager = createMockFrameBufferManager();
                const textureManager = createMockTextureManager();
                const pipelineManager = createMockPipelineManager();

                execute(
                    device,
                    commandEncoder,
                    null,
                    attachment,
                    bufferManager,
                    frameBufferManager,
                    textureManager,
                    pipelineManager
                );

                expect(pipelineManager.getPipeline).toHaveBeenCalledWith(expected);
            });
        });
    });

    describe("error handling", () =>
    {
        it("should return null when pipeline not found", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager(false, true);

            const result = execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager
            );

            expect(result).toBe(null);
            expect(console.error).toHaveBeenCalledWith("[WebGPU] Instanced pipeline not found");
        });

        it("should return null when bind group layout not found", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager(true, false);

            const result = execute(
                device,
                commandEncoder,
                null,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager
            );

            expect(result).toBe(null);
            expect(console.error).toHaveBeenCalledWith("[WebGPU] Instanced bind group layout not found");
        });
    });
});
