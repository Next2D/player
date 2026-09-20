import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../interface/IAttachmentObject";
import type { BufferManager } from "../../BufferManager";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import { execute } from "./ContextProcessComplexBlendQueueUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;
vi.stubGlobal("GPUTextureUsage", { "TEXTURE_BINDING": 4 });

// Mock BlendInstancedManager
const mockQueue: any[] = [];
const mockGetComplexBlendQueue = vi.fn(() => mockQueue);
const mockClearComplexBlendQueue = vi.fn();

vi.mock("../../Blend/BlendInstancedManager", () => ({
    "getComplexBlendQueue": () => mockGetComplexBlendQueue(),
    "clearComplexBlendQueue": () => mockClearComplexBlendQueue()
}));

// Mock BlendApplyComplexBlendUseCase
const mockBlendApplyComplexBlendUseCase = vi.fn();
vi.mock("../../Blend/usecase/BlendApplyComplexBlendUseCase", () => ({
    "execute": (...args: any[]) => mockBlendApplyComplexBlendUseCase(...args)
}));

vi.mock("../../AtlasManager", () => ({
    "$getAtlasAttachmentObject": vi.fn(() => null)
}));

describe("ContextProcessComplexBlendQueueUseCase", () =>
{
    const createMockDevice = () =>
    {
        return {
            "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
            "queue": {
                "writeBuffer": vi.fn()
            },
            "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
        } as unknown as GPUDevice;
    };

    const createMockCommandEncoder = () =>
    {
        const mockPassEncoder = {
            "setPipeline": vi.fn(),
            "setBindGroup": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };
        return {
            "beginRenderPass": vi.fn(() => mockPassEncoder),
            "copyTextureToTexture": vi.fn(),
            "_mockPassEncoder": mockPassEncoder
        } as unknown as GPUCommandEncoder & { _mockPassEncoder: any };
    };

    const createMockAttachment = (id: number = 1, hasTexture: boolean = true): IAttachmentObject =>
    {
        const mockTexture = hasTexture ? {
            "resource": { "label": "mockTexture" } as unknown as GPUTexture,
            "view": { "label": "mockTextureView" } as unknown as GPUTextureView
        } : null;

        return {
            "id": id,
            "width": 800,
            "height": 600,
            "clipLevel": 0,
            "texture": mockTexture
        } as IAttachmentObject;
    };

    const createMockFrameBufferManager = () =>
    {
        const tempAttachments: IAttachmentObject[] = [];
        return {
            "getAttachment": vi.fn((name: string) => {
                if (name === "atlas") {
                    return createMockAttachment(999);
                }
                return null;
            }),
            "createTemporaryAttachment": vi.fn((w: number, h: number) => {
                const att = createMockAttachment(tempAttachments.length + 100);
                att.width = w;
                att.height = h;
                tempAttachments.push(att);
                return att;
            }),
            "releaseTemporaryAttachment": vi.fn(),
            "createRenderPassDescriptor": vi.fn(() => ({
                "colorAttachments": [{ "view": {}, "loadOp": "clear", "storeOp": "store" }]
            }))
        } as unknown as FrameBufferManager;
    };

    const createMockTextureManager = () =>
    {
        return {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
        } as unknown as TextureManager;
    };

    const createMockPipelineManager = (hasPipelines: boolean = true) =>
    {
        return {
            "getPipeline": vi.fn(() => hasPipelines ? { "label": "mockPipeline" } : null),
            "getBindGroupLayout": vi.fn(() => hasPipelines ? { "label": "mockLayout" } : null)
        } as unknown as PipelineManager;
    };

    const createMockBufferManager = () =>
    {
        return {
            "acquireUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" })),
            "allocateUniformBinding": vi.fn((data: Float32Array) => ({
                "buffer": { "label": "mockUniformBuffer" }, "offset": 256, "size": data.byteLength
            }))
        } as unknown as BufferManager;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockQueue.length = 0;
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("empty queue", () =>
    {
        it("should return early when queue is empty", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(commandEncoder.copyTextureToTexture).not.toHaveBeenCalled();
            expect(mockClearComplexBlendQueue).not.toHaveBeenCalled();
        });
    });

    describe("missing attachments", () =>
    {
        it("should clear queue when main attachment is null", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 0, 0],
                "blend_mode": 2,
                "global_alpha": 1
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                null,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });

        it("should clear queue when main attachment has no texture", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 0, 0],
                "blend_mode": 2,
                "global_alpha": 1
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment(1, false);
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });

        it("should clear queue when atlas attachment not available", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 0, 0],
                "blend_mode": 2,
                "global_alpha": 1
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment();
            const frameBufferManager = createMockFrameBufferManager();
            (frameBufferManager.getAttachment as ReturnType<typeof vi.fn>).mockReturnValue(null);
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });
    });

    describe("queue processing", () =>
    {
        it.each([
            { "format": "rgba8unorm", "sampleCount": 4, "usage": 4, "local": true },
            { "format": "bgra8unorm", "sampleCount": 4, "usage": 4, "local": true },
            { "format": "rgba16float", "sampleCount": 4, "usage": 4, "local": false },
            { "format": "rgba8unorm-srgb", "sampleCount": 4, "usage": 4, "local": false },
            { "format": "rgba8unorm", "sampleCount": 4, "usage": 0, "local": false },
            { "format": "rgba8unorm", "sampleCount": 1, "usage": 4, "local": false },
            { "format": "rgba8unorm", "sampleCount": 4, "usage": 4, "local": false, "clean": true }
        ])("resolves backdrop safely for $format/$sampleCount/$usage/$clean", ({ format, sampleCount, usage, local, clean = false }) =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 200, "y_max": 200,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [2, 0, 0, 0, 2, 0, 0, 0],
                "blend_mode": "multiply", "global_alpha": 1
            });
            mockBlendApplyComplexBlendUseCase.mockReturnValue(createMockAttachment());
            const device = createMockDevice();
            const bindings: GPUBufferBinding[] = [];
            vi.mocked(device.createBindGroup).mockImplementation(descriptor =>
            {
                bindings.push({ ...Array.from(descriptor.entries)[0].resource as GPUBufferBinding });
                return {} as GPUBindGroup;
            });
            const bufferManager = createMockBufferManager();
            const main = createMockAttachment();
            main.msaa = true;
            main.msaaDirty = !clean;
            main.msaaTexture = {
                "view": {} as GPUTextureView, "resource": { format, sampleCount, usage }
            } as NonNullable<IAttachmentObject["msaaTexture"]>;
            mockBlendApplyComplexBlendUseCase.mockImplementation(() =>
            {
                expect(main.msaaDirty).toBe(local);
                return createMockAttachment(200);
            });
            const frameBufferManager = createMockFrameBufferManager();
            execute(device, createMockCommandEncoder(), main,
                frameBufferManager, createMockTextureManager(), createMockPipelineManager(), bufferManager);
            expect(bindings.map(binding => [binding.offset, binding.size])).toEqual([
                [256, 48], [256, 32]
            ]);
            expect(bufferManager.allocateUniformBinding).toHaveBeenCalledTimes(2);
            expect(frameBufferManager.createTemporaryAttachment).toHaveBeenCalledTimes(2);
            expect(mockBlendApplyComplexBlendUseCase.mock.calls[0][1]).toBe(main);
            expect(mockBlendApplyComplexBlendUseCase.mock.calls[0][5]).toEqual([0, 0]);
            expect(mockBlendApplyComplexBlendUseCase.mock.calls[0][6]).toBe(local ? main.msaaTexture.view : undefined);
            const resolve = expect(frameBufferManager.createRenderPassDescriptor);
            (local || clean ? resolve.not : resolve).toHaveBeenCalledWith(
                main.msaaTexture.view, 0, 0, 0, 0, "load", main.texture!.view);
            expect(main.msaaDirty).toBe(true); // Output dirties MSAA again for the next queued blend.
            expect(vi.mocked(frameBufferManager.releaseTemporaryAttachment).mock.calls.some(([attachment]) => attachment === main)).toBe(false);
            expect(device.queue.writeBuffer).not.toHaveBeenCalled();
        });

        it("should skip items with zero dimensions", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 0, "y_max": 0, // zero dimensions
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 0, 0],
                "blend_mode": 2,
                "global_alpha": 1
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(frameBufferManager.createTemporaryAttachment).not.toHaveBeenCalled();
            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });

        it("should skip items outside main attachment bounds", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 1000, 1000], // position outside 800x600
                "blend_mode": 2,
                "global_alpha": 1
            });

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(frameBufferManager.createTemporaryAttachment).not.toHaveBeenCalled();
            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });

        it("should clear queue after processing", () =>
        {
            mockQueue.push({
                "node": { "x": 0, "y": 0, "w": 100, "h": 100 },
                "x_min": 0, "y_min": 0, "x_max": 100, "y_max": 100,
                "color_transform": [1, 1, 1, 1, 0, 0, 0, 0],
                "matrix": [1, 0, 0, 0, 1, 0, 50, 50],
                "blend_mode": 2,
                "global_alpha": 1
            });

            mockBlendApplyComplexBlendUseCase.mockReturnValue(createMockAttachment(200));

            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const mainAttachment = createMockAttachment();
            const frameBufferManager = createMockFrameBufferManager();
            const textureManager = createMockTextureManager();
            const pipelineManager = createMockPipelineManager();

            const bufferManager = createMockBufferManager();

            execute(
                device,
                commandEncoder,
                mainAttachment,
                frameBufferManager,
                textureManager,
                pipelineManager,
                bufferManager
            );

            expect(mockClearComplexBlendQueue).toHaveBeenCalled();
        });
    });
});
