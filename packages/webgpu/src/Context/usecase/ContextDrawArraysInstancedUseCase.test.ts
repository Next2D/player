import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute } from "./ContextDrawArraysInstancedUseCase";

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

vi.mock("../../AtlasManager", () => ({
    "$getAtlasAttachmentObject": vi.fn(() => ({
        "texture": {
            "resource": { "label": "atlasTexture" },
            "view": { "label": "atlasTextureView" }
        }
    }))
}));

import { getInstancedShaderManager } from "../../Blend/BlendInstancedManager";
import { $getCurrentBlendMode } from "../../Blend";
import { $isMaskTestEnabled } from "../../Mask";
import { $getAtlasAttachmentObject } from "../../AtlasManager";

describe("ContextDrawArraysInstancedUseCase", () =>
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
            "getUnitRectBuffer": vi.fn(() => ({ "label": "mockUnitRectBuffer" }))
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
        return {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
        } as unknown as TextureManager;
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
        ($isMaskTestEnabled as ReturnType<typeof vi.fn>).mockReturnValue(false);
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

    describe("render pass handling", () =>
    {
        it("should end existing render pass before creating new one", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const renderPassEncoder = createMockRenderPassEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            execute(
                device,
                commandEncoder,
                renderPassEncoder,
                attachment,
                bufferManager,
                frameBufferManager,
                textureManager,
                pipelineManager
            );

            expect(renderPassEncoder.end).toHaveBeenCalled();
        });
    });

    describe("pipeline selection based on blend mode", () =>
    {
        it("should use instanced_normal for normal blend mode", () =>
        {
            ($getCurrentBlendMode as ReturnType<typeof vi.fn>).mockReturnValue("normal");

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

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("instanced_normal");
        });

        it("should use instanced_add for add blend mode", () =>
        {
            ($getCurrentBlendMode as ReturnType<typeof vi.fn>).mockReturnValue("add");

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

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("instanced_add");
        });

        it("should use instanced_screen for screen blend mode", () =>
        {
            ($getCurrentBlendMode as ReturnType<typeof vi.fn>).mockReturnValue("screen");

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

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("instanced_screen");
        });
    });

    describe("atlas attachment handling", () =>
    {
        it("should use atlas attachment from AtlasManager", () =>
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
                pipelineManager
            );

            // AtlasManagerから取得するため、frameBufferManager.getAttachmentは呼ばれない
            expect($getAtlasAttachmentObject).toHaveBeenCalled();
            expect(commandEncoder._mockPassEncoder.draw).toHaveBeenCalled();
        });

        it("should return null when atlas attachment not found", () =>
        {
            // AtlasManagerとFrameBufferManager両方からnullを返す
            ($getAtlasAttachmentObject as ReturnType<typeof vi.fn>).mockReturnValueOnce(null);

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const attachment = createMockAttachment();
            const bufferManager = createMockBufferManager();
            const frameBufferManager = {
                ...createMockFrameBufferManager(),
                "getAttachment": vi.fn(() => null)
            } as unknown as FrameBufferManager;
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

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
            expect(console.error).toHaveBeenCalledWith("[WebGPU] Atlas attachment not found");
        });
    });

    describe("drawing", () =>
    {
        it("should draw with correct instance count", () =>
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
                pipelineManager
            );

            expect(commandEncoder._mockPassEncoder.draw).toHaveBeenCalledWith(6, 10, 0, 0);
        });

        it("should clear shader manager after drawing", () =>
        {
            const mockClear = vi.fn();
            (getInstancedShaderManager as ReturnType<typeof vi.fn>).mockReturnValue({
                "count": 10,
                "clear": mockClear
            });

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

            expect(mockClear).toHaveBeenCalled();
        });
    });

    describe("mask handling", () =>
    {
        it("should use masked pipeline when mask is enabled", () =>
        {
            ($isMaskTestEnabled as ReturnType<typeof vi.fn>).mockReturnValue(true);

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

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("instanced_masked");
        });

        it("should create stencil render pass descriptor when mask enabled", () =>
        {
            ($isMaskTestEnabled as ReturnType<typeof vi.fn>).mockReturnValue(true);

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

            expect(frameBufferManager.createStencilRenderPassDescriptor).toHaveBeenCalled();
        });
    });
});
