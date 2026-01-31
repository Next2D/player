import { describe, it, expect, vi, beforeEach } from "vitest";
import type { IAttachmentObject } from "../../../interface/IAttachmentObject";
import type { IFilterConfig } from "../../../interface/IFilterConfig";
import type { ComputePipelineManager } from "../../../Compute/ComputePipelineManager";
import { execute, shouldUseComputeShader } from "./BlurFilterComputeShaderService";

// Mock the compute blur service
vi.mock("../../../Compute/service/ComputeExecuteBlurService", () => ({
    "execute": vi.fn()
}));

import { execute as mockExecuteBlurCompute } from "../../../Compute/service/ComputeExecuteBlurService";

describe("BlurFilterComputeShaderService", () =>
{
    const createMockAttachment = (width: number = 256, height: number = 256): IAttachmentObject =>
    {
        return {
            "id": 1,
            "width": width,
            "height": height,
            "clipLevel": 0,
            "msaa": false,
            "mask": false,
            "color": null,
            "texture": {
                "id": 1,
                "width": width,
                "height": height,
                "area": width * height,
                "smooth": true,
                "resource": {} as GPUTexture,
                "view": {} as GPUTextureView
            },
            "stencil": null,
            "msaaTexture": null,
            "msaaStencil": null
        };
    };

    const createMockDevice = () =>
    {
        return {} as GPUDevice;
    };

    const createMockCommandEncoder = () =>
    {
        return {} as GPUCommandEncoder;
    };

    const createMockComputePipelineManager = () =>
    {
        return {} as ComputePipelineManager;
    };

    const createMockConfig = () =>
    {
        return {} as IFilterConfig;
    };

    beforeEach(() =>
    {
        vi.clearAllMocks();
    });

    describe("execute", () =>
    {
        it("should call executeBlurCompute with correct parameters", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const computePipelineManager = createMockComputePipelineManager();
            const config = createMockConfig();
            const source = createMockAttachment();
            const dest = createMockAttachment();

            execute(device, commandEncoder, computePipelineManager, config, source, dest, true, 16);

            expect(mockExecuteBlurCompute).toHaveBeenCalledWith(
                device,
                commandEncoder,
                computePipelineManager,
                source,
                dest,
                true,
                8  // radius = ceil(16 / 2) = 8
            );
        });

        it("should calculate radius as ceil of blur / 2", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const computePipelineManager = createMockComputePipelineManager();
            const config = createMockConfig();
            const source = createMockAttachment();
            const dest = createMockAttachment();

            execute(device, commandEncoder, computePipelineManager, config, source, dest, false, 15);

            expect(mockExecuteBlurCompute).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                false,
                8  // radius = ceil(15 / 2) = 8
            );
        });

        it("should pass isHorizontal = true for horizontal blur", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const computePipelineManager = createMockComputePipelineManager();
            const config = createMockConfig();
            const source = createMockAttachment();
            const dest = createMockAttachment();

            execute(device, commandEncoder, computePipelineManager, config, source, dest, true, 10);

            expect(mockExecuteBlurCompute).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                true,
                expect.any(Number)
            );
        });

        it("should pass isHorizontal = false for vertical blur", () =>
        {
            const device = createMockDevice();
            const commandEncoder = createMockCommandEncoder();
            const computePipelineManager = createMockComputePipelineManager();
            const config = createMockConfig();
            const source = createMockAttachment();
            const dest = createMockAttachment();

            execute(device, commandEncoder, computePipelineManager, config, source, dest, false, 10);

            expect(mockExecuteBlurCompute).toHaveBeenCalledWith(
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                expect.anything(),
                false,
                expect.any(Number)
            );
        });
    });

    describe("shouldUseComputeShader", () =>
    {
        describe("blur threshold", () =>
        {
            it("should return true when blur >= 8 and size >= 256", () =>
            {
                const result = shouldUseComputeShader(8, 8, 256, 256);

                expect(result).toBe(true);
            });

            it("should return true when blurX >= 8 (using max)", () =>
            {
                const result = shouldUseComputeShader(10, 4, 256, 256);

                expect(result).toBe(true);
            });

            it("should return true when blurY >= 8 (using max)", () =>
            {
                const result = shouldUseComputeShader(4, 10, 256, 256);

                expect(result).toBe(true);
            });

            it("should return false when both blurs < 8", () =>
            {
                const result = shouldUseComputeShader(7, 7, 256, 256);

                expect(result).toBe(false);
            });

            it("should return false when max blur < 8", () =>
            {
                const result = shouldUseComputeShader(5, 6, 512, 512);

                expect(result).toBe(false);
            });
        });

        describe("size threshold", () =>
        {
            it("should return true when min size >= 256", () =>
            {
                const result = shouldUseComputeShader(10, 10, 256, 256);

                expect(result).toBe(true);
            });

            it("should return true when width >= 256 and height > 256", () =>
            {
                const result = shouldUseComputeShader(10, 10, 256, 512);

                expect(result).toBe(true);
            });

            it("should return true when height >= 256 and width > 256", () =>
            {
                const result = shouldUseComputeShader(10, 10, 512, 256);

                expect(result).toBe(true);
            });

            it("should return false when width < 256", () =>
            {
                const result = shouldUseComputeShader(10, 10, 100, 512);

                expect(result).toBe(false);
            });

            it("should return false when height < 256", () =>
            {
                const result = shouldUseComputeShader(10, 10, 512, 100);

                expect(result).toBe(false);
            });

            it("should return false when both dimensions < 256", () =>
            {
                const result = shouldUseComputeShader(20, 20, 100, 100);

                expect(result).toBe(false);
            });
        });

        describe("edge cases", () =>
        {
            it("should return true at exact thresholds", () =>
            {
                const result = shouldUseComputeShader(8, 0, 256, 256);

                expect(result).toBe(true);
            });

            it("should return false just below blur threshold", () =>
            {
                const result = shouldUseComputeShader(7.9, 7.9, 256, 256);

                expect(result).toBe(false);
            });

            it("should return false just below size threshold", () =>
            {
                const result = shouldUseComputeShader(10, 10, 255, 255);

                expect(result).toBe(false);
            });

            it("should return false when only one condition is met", () =>
            {
                // Large blur but small size
                expect(shouldUseComputeShader(20, 20, 100, 100)).toBe(false);

                // Large size but small blur
                expect(shouldUseComputeShader(5, 5, 1024, 1024)).toBe(false);
            });

            it("should handle zero blur values", () =>
            {
                const result = shouldUseComputeShader(0, 0, 512, 512);

                expect(result).toBe(false);
            });

            it("should handle large values", () =>
            {
                const result = shouldUseComputeShader(100, 100, 4096, 4096);

                expect(result).toBe(true);
            });
        });
    });
});
