import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Node } from "@next2d/texture-packer";
import type { FrameBufferManager } from "../../FrameBufferManager";
import type { TextureManager } from "../../TextureManager";
import type { PipelineManager } from "../../Shader/PipelineManager";
import type { BufferManager } from "../../BufferManager";
import { execute } from "./ContextApplyFilterUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock Filter offset
vi.mock("../../Filter/FilterOffset", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

// Mock WebGPUUtil
vi.mock("../../WebGPUUtil", () => ({
    "WebGPUUtil": {
        "getDevicePixelRatio": vi.fn(() => 1)
    }
}));

// Mock AtlasManager
vi.mock("../../AtlasManager", () => ({
    "$getAtlasAttachmentObject": vi.fn(() => null)
}));

// Mock BlendApplyComplexBlendUseCase
vi.mock("../../Blend/usecase/BlendApplyComplexBlendUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

// Mock all filter usecases
vi.mock("../../Filter/BlurFilter/FilterApplyBlurFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/ColorMatrixFilter/FilterApplyColorMatrixFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/GlowFilter/FilterApplyGlowFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/DropShadowFilter/FilterApplyDropShadowFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/BevelFilter/FilterApplyBevelFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/ConvolutionFilter/FilterApplyConvolutionFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/GradientBevelFilter/FilterApplyGradientBevelFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/GradientGlowFilter/FilterApplyGradientGlowFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

vi.mock("../../Filter/DisplacementMapFilter/FilterApplyDisplacementMapFilterUseCase", () => ({
    "execute": vi.fn((attachment) => attachment)
}));

import { execute as filterApplyBlurFilterUseCase } from "../../Filter/BlurFilter/FilterApplyBlurFilterUseCase";
import { execute as filterApplyColorMatrixFilterUseCase } from "../../Filter/ColorMatrixFilter/FilterApplyColorMatrixFilterUseCase";
import { execute as filterApplyGlowFilterUseCase } from "../../Filter/GlowFilter/FilterApplyGlowFilterUseCase";
import { execute as filterApplyDropShadowFilterUseCase } from "../../Filter/DropShadowFilter/FilterApplyDropShadowFilterUseCase";
import { execute as filterApplyBevelFilterUseCase } from "../../Filter/BevelFilter/FilterApplyBevelFilterUseCase";

describe("ContextApplyFilterUseCase", () =>
{
    const createMockNode = (): Node =>
    {
        return {
            "x": 10,
            "y": 20,
            "w": 100,
            "h": 80
        } as Node;
    };

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
            "setViewport": vi.fn(),
            "setScissorRect": vi.fn(),
            "draw": vi.fn(),
            "end": vi.fn()
        };
        return {
            "copyTextureToTexture": vi.fn(),
            "beginRenderPass": vi.fn(() => mockPassEncoder),
            "_mockPassEncoder": mockPassEncoder
        } as unknown as GPUCommandEncoder & { _mockPassEncoder: any };
    };

    const createMockFrameBufferManager = () =>
    {
        const mockAttachment = {
            "id": 1,
            "width": 100,
            "height": 80,
            "texture": {
                "resource": { "label": "tempTexture" } as unknown as GPUTexture,
                "view": { "label": "tempTextureView" } as unknown as GPUTextureView
            }
        };
        return {
            "createTemporaryAttachment": vi.fn(() => mockAttachment),
            "releaseTemporaryAttachment": vi.fn(),
            "getAttachment": vi.fn((name: string) => {
                if (name === "atlas") {
                    return {
                        "texture": {
                            "resource": { "label": "atlasTexture" } as unknown as GPUTexture,
                            "view": { "label": "atlasTextureView" } as unknown as GPUTextureView
                        }
                    };
                }
                if (name === "main") {
                    return {
                        "width": 800,
                        "height": 600,
                        "texture": {
                            "resource": { "label": "mainTexture" } as unknown as GPUTexture,
                            "view": { "label": "mainTextureView" } as unknown as GPUTextureView
                        }
                    };
                }
                return null;
            }),
            "createRenderPassDescriptor": vi.fn(() => ({ "label": "mockDescriptor" }))
        } as unknown as FrameBufferManager;
    };

    const createMockPipelineManager = () =>
    {
        return {
            "getPipeline": vi.fn(() => ({ "label": "mockPipeline" })),
            "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
        } as unknown as PipelineManager;
    };

    const createMockTextureManager = () =>
    {
        return {
            "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
        } as unknown as TextureManager;
    };

    const createMockBufferManager = () =>
    {
        return {
            "acquireUniformBuffer": vi.fn(() => ({ "label": "mockUniformBuffer" }))
        } as unknown as BufferManager;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("filter type dispatch", () =>
    {
        it("should apply blur filter (type 1)", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            // Type 1 = Blur filter, blurX, blurY, quality
            const params = new Float32Array([1, 5, 5, 2]);

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                params,
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(filterApplyBlurFilterUseCase).toHaveBeenCalled();
        });

        it("should apply color matrix filter (type 2)", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            // Type 2 = ColorMatrix filter, 20 matrix values
            const params = new Float32Array([
                2,  // type
                1, 0, 0, 0, 0,  // row 1
                0, 1, 0, 0, 0,  // row 2
                0, 0, 1, 0, 0,  // row 3
                0, 0, 0, 1, 0   // row 4
            ]);

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                params,
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(filterApplyColorMatrixFilterUseCase).toHaveBeenCalled();
        });

        it("should apply glow filter (type 6)", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            // Type 6 = Glow filter
            // color, alpha, blurX, blurY, strength, quality, inner, knockout
            const params = new Float32Array([6, 0xFF0000, 1, 5, 5, 2, 2, 0, 0]);

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                params,
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(filterApplyGlowFilterUseCase).toHaveBeenCalled();
        });

        it("should apply drop shadow filter (type 5)", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            // Type 5 = DropShadow filter
            // distance, angle, color, alpha, blurX, blurY, strength, quality, inner, knockout, hideObject
            const params = new Float32Array([5, 4, 45, 0x000000, 1, 5, 5, 1, 2, 0, 0, 0]);

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                params,
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(filterApplyDropShadowFilterUseCase).toHaveBeenCalled();
        });

        it("should apply bevel filter (type 0)", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            // Type 0 = Bevel filter
            // distance, angle, highlightColor, highlightAlpha, shadowColor, shadowAlpha, blurX, blurY, strength, quality, type, knockout
            const params = new Float32Array([0, 4, 45, 0xFFFFFF, 1, 0x000000, 1, 4, 4, 1, 2, 0, 0]);

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                params,
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(filterApplyBevelFilterUseCase).toHaveBeenCalled();
        });
    });

    describe("texture handling", () =>
    {
        it("should create temporary attachment from node", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                new Float32Array([1, 5, 5, 2]),  // blur filter
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(frameBufferManager.createTemporaryAttachment).toHaveBeenCalledWith(100, 80);
        });

        it("should copy texture from atlas", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                new Float32Array([1, 5, 5, 2]),
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(commandEncoder.copyTextureToTexture).toHaveBeenCalledWith(
                expect.objectContaining({
                    "origin": { "x": 10, "y": 20, "z": 0 }
                }),
                expect.objectContaining({
                    "origin": { "x": 0, "y": 0, "z": 0 }
                }),
                expect.objectContaining({
                    "width": 100,
                    "height": 80
                })
            );
        });

        it("should release temporary attachment after use", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                new Float32Array([1, 5, 5, 2]),
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
        });
    });

    describe("drawing to main", () =>
    {
        it("should draw filter result to main attachment", () =>
        {
            const node = createMockNode();
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const frameBufferManager = createMockFrameBufferManager();
            const pipelineManager = createMockPipelineManager();
            const textureManager = createMockTextureManager();
            const bufferManager = createMockBufferManager();

            const config = {
                device,
                commandEncoder,
                bufferManager,
                frameBufferManager,
                pipelineManager,
                textureManager
            };

            execute(
                node,
                100, 80,
                false,
                new Float32Array([1, 0, 0, 1, 0, 0]),
                new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]),
                "normal",
                new Float32Array([0, 0, 100, 80]),
                new Float32Array([1, 5, 5, 2]),
                config,
                { "label": "mainTextureView" } as unknown as GPUTextureView,
                bufferManager
            );

            expect(pipelineManager.getPipeline).toHaveBeenCalledWith("filter_output");
            expect(commandEncoder._mockPassEncoder.draw).toHaveBeenCalled();
        });
    });
});
