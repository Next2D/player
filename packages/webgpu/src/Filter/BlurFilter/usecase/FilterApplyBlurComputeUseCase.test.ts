import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../../interface/IFilterConfig";
import type { ComputePipelineManager } from "../../../Compute/ComputePipelineManager";
import { execute } from "./FilterApplyBlurComputeUseCase";

// Mock GPUBufferUsage
const GPUBufferUsage = {
    UNIFORM: 0x40,
    COPY_DST: 0x08
};
(globalThis as any).GPUBufferUsage = GPUBufferUsage;

// Mock offset - use object that will be imported
vi.mock("../../index", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

import { $offset } from "../../index";

// Mock calculateBlurParams
const mockCalculateBlurParams = vi.fn();
vi.mock("../../BlurFilterUseCase", () => ({
    "calculateBlurParams": (...args: any[]) => mockCalculateBlurParams(...args)
}));

// Mock BlurFilterComputeShaderService
const mockBlurComputeService = vi.fn();
const mockShouldUseComputeShader = vi.fn();
vi.mock("../service/BlurFilterComputeShaderService", () => ({
    "execute": (...args: any[]) => mockBlurComputeService(...args),
    "shouldUseComputeShader": (...args: any[]) => mockShouldUseComputeShader(...args)
}));

// Mock FilterApplyBlurFilterUseCase (fragment fallback)
const mockExecuteFragmentBlur = vi.fn();
vi.mock("../FilterApplyBlurFilterUseCase", () => ({
    "execute": (...args: any[]) => mockExecuteFragmentBlur(...args)
}));

describe("FilterApplyBlurComputeUseCase", () =>
{
    const createMockAttachment = (width: number = 100, height: number = 100): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "texture": {
                "resource": { "label": "mockTexture" } as unknown as GPUTexture,
                "view": { "label": "mockTextureView" } as unknown as GPUTextureView
            }
        } as IAttachmentObject;
    };

    const createMockConfig = (): IFilterConfig =>
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
            "device": {
                "createBuffer": vi.fn(() => ({ "label": "mockBuffer" })),
                "queue": { "writeBuffer": vi.fn() },
                "createBindGroup": vi.fn(() => ({ "label": "mockBindGroup" }))
            } as unknown as GPUDevice,
            "commandEncoder": {
                "beginRenderPass": vi.fn(() => mockPassEncoder)
            } as unknown as GPUCommandEncoder,
            "frameBufferManager": {
                "createTemporaryAttachment": vi.fn((w: number, h: number) => createMockAttachment(w, h)),
                "releaseTemporaryAttachment": vi.fn(),
                "createRenderPassDescriptor": vi.fn(() => ({
                    "colorAttachments": [{ "view": {}, "loadOp": "clear", "storeOp": "store" }]
                }))
            },
            "pipelineManager": {
                "getPipeline": vi.fn(() => ({ "label": "mockPipeline" })),
                "getBindGroupLayout": vi.fn(() => ({ "label": "mockLayout" }))
            },
            "textureManager": {
                "createSampler": vi.fn(() => ({ "label": "mockSampler" }))
            }
        } as unknown as IFilterConfig;
    };

    const createMockComputePipelineManager = (): ComputePipelineManager =>
    {
        return {
            "getPipeline": vi.fn(() => ({ "label": "mockComputePipeline" })),
            "getBindGroupLayout": vi.fn(() => ({ "label": "mockComputeLayout" }))
        } as unknown as ComputePipelineManager;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
        $offset.x = 0;
        $offset.y = 0;
        vi.spyOn(console, "error").mockImplementation(() => {});

        // Default mock implementations
        mockCalculateBlurParams.mockReturnValue({
            "baseBlurX": 16,
            "baseBlurY": 16,
            "offsetX": 32,
            "offsetY": 32,
            "bufferScaleX": 1,
            "bufferScaleY": 1
        });
    });

    describe("compute shader decision", () =>
    {
        it("should use fragment shader when compute is not appropriate", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(false);
            const expectedResult = createMockAttachment(200, 200);
            mockExecuteFragmentBlur.mockReturnValue(expectedResult);

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            const result = execute(
                sourceAttachment,
                matrix,
                4,  // small blurX
                4,  // small blurY
                1,
                1,
                config,
                computePipelineManager
            );

            expect(mockShouldUseComputeShader).toHaveBeenCalled();
            expect(mockExecuteFragmentBlur).toHaveBeenCalled();
            expect(result).toBe(expectedResult);
        });

        it("should use compute shader when appropriate", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);
            mockCalculateBlurParams.mockReturnValue({
                "baseBlurX": 32,
                "baseBlurY": 32,
                "offsetX": 64,
                "offsetY": 64,
                "bufferScaleX": 1,
                "bufferScaleY": 1
            });

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                32,
                32,
                1,
                1,
                config,
                computePipelineManager
            );

            expect(mockShouldUseComputeShader).toHaveBeenCalled();
            expect(mockExecuteFragmentBlur).not.toHaveBeenCalled();
            expect(mockBlurComputeService).toHaveBeenCalled();
        });
    });

    describe("blur parameters", () =>
    {
        it("should calculate blur parameters correctly", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);

            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([2, 0, 0, 0, 2, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                16,
                3,
                2,
                config,
                computePipelineManager
            );

            expect(mockCalculateBlurParams).toHaveBeenCalledWith(
                matrix,
                16,
                16,
                3,
                2
            );
        });

        it("should update offset based on blur parameters", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);
            mockCalculateBlurParams.mockReturnValue({
                "baseBlurX": 16,
                "baseBlurY": 16,
                "offsetX": 20,
                "offsetY": 25,
                "bufferScaleX": 1,
                "bufferScaleY": 1
            });

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                16,
                1,
                1,
                config,
                computePipelineManager
            );

            expect($offset.x).toBe(20);
            expect($offset.y).toBe(25);
        });
    });

    describe("multi-pass blur", () =>
    {
        it("should perform horizontal and vertical passes for each quality level", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                16,
                3,  // quality = 3
                1,
                config,
                computePipelineManager
            );

            // 3 quality passes * 2 directions (horizontal + vertical) = 6 calls
            expect(mockBlurComputeService).toHaveBeenCalledTimes(6);
        });

        it("should skip horizontal pass when blurX is 0", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);
            mockCalculateBlurParams.mockReturnValue({
                "baseBlurX": 0,
                "baseBlurY": 16,
                "offsetX": 0,
                "offsetY": 32,
                "bufferScaleX": 1,
                "bufferScaleY": 1
            });

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                0,
                16,
                1,
                1,
                config,
                computePipelineManager
            );

            // Only vertical passes
            expect(mockBlurComputeService).toHaveBeenCalledTimes(1);
            // Should be called with horizontal=false
            expect(mockBlurComputeService).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                false,  // horizontal = false (vertical pass)
                expect.any(Number)
            );
        });

        it("should skip vertical pass when blurY is 0", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);
            mockCalculateBlurParams.mockReturnValue({
                "baseBlurX": 16,
                "baseBlurY": 0,
                "offsetX": 32,
                "offsetY": 0,
                "bufferScaleX": 1,
                "bufferScaleY": 1
            });

            const sourceAttachment = createMockAttachment();
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                0,
                1,
                1,
                config,
                computePipelineManager
            );

            // Only horizontal passes
            expect(mockBlurComputeService).toHaveBeenCalledTimes(1);
            // Should be called with horizontal=true
            expect(mockBlurComputeService).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                true,  // horizontal = true
                expect.any(Number)
            );
        });
    });

    describe("buffer management", () =>
    {
        it("should create temporary attachments for ping-pong buffer", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);

            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                16,
                1,
                1,
                config,
                computePipelineManager
            );

            // Should create 2 temporary attachments for ping-pong
            expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalledTimes(2);
        });

        it("should release unused buffer after processing", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);

            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            execute(
                sourceAttachment,
                matrix,
                16,
                16,
                1,
                1,
                config,
                computePipelineManager
            );

            // Should release the unused ping-pong buffer
            expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
        });
    });

    describe("return value", () =>
    {
        it("should return result attachment after compute blur", () =>
        {
            mockShouldUseComputeShader.mockReturnValue(true);

            const sourceAttachment = createMockAttachment(100, 100);
            const matrix = new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
            const config = createMockConfig();
            const computePipelineManager = createMockComputePipelineManager();

            const result = execute(
                sourceAttachment,
                matrix,
                16,
                16,
                1,
                1,
                config,
                computePipelineManager
            );

            expect(result).toBeDefined();
            expect(result.texture).toBeDefined();
        });
    });
});
