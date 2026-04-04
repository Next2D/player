import { execute } from "./ContextContainerEndLayerUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

const mockAttachment = {
    "width": 800,
    "height": 600,
    "texture": { "view": {} },
    "msaa": false,
    "msaaTexture": null
};

const mockMainAttachment = {
    "width": 800,
    "height": 600,
    "texture": { "view": {} },
    "msaa": false,
    "msaaTexture": null
};

const mockPassEncoder = {
    "setPipeline": vi.fn(),
    "setBindGroup": vi.fn(),
    "setViewport": vi.fn(),
    "setScissorRect": vi.fn(),
    "draw": vi.fn(),
    "end": vi.fn()
};

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "set": vi.fn(),
        "get": vi.fn()
    }
}));

vi.mock("../../Filter/FilterOffset", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

vi.mock("../../WebGPUUtil", () => ({
    "WebGPUUtil": {
        "getDevicePixelRatio": vi.fn(() => 1)
    }
}));

vi.mock("../../Filter/BlurFilter/FilterApplyBlurFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/ColorMatrixFilter/FilterApplyColorMatrixFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/GlowFilter/FilterApplyGlowFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/DropShadowFilter/FilterApplyDropShadowFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/BevelFilter/FilterApplyBevelFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/ConvolutionFilter/FilterApplyConvolutionFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/GradientBevelFilter/FilterApplyGradientBevelFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/GradientGlowFilter/FilterApplyGradientGlowFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Filter/DisplacementMapFilter/FilterApplyDisplacementMapFilterUseCase", () => ({
    "execute": vi.fn((_att: any) => mockAttachment)
}));
vi.mock("../../Blend/usecase/BlendApplyComplexBlendUseCase", () => ({
    "execute": vi.fn(() => mockAttachment)
}));

describe("ContextContainerEndLayerUseCase.js test", () => {

    const createMockConfig = () => ({
        "device": {
            "createBindGroup": vi.fn(() => ({}))
        },
        "commandEncoder": {
            "beginRenderPass": vi.fn(() => mockPassEncoder)
        },
        "bufferManager": {
            "acquireAndWriteUniformBuffer": vi.fn(() => ({}))
        },
        "frameBufferManager": {
            "createTemporaryAttachment": vi.fn(() => ({
                ...mockAttachment,
                "texture": { "view": {} }
            })),
            "releaseTemporaryAttachment": vi.fn(),
            "createRenderPassDescriptor": vi.fn(() => ({}))
        },
        "pipelineManager": {
            "getPipeline": vi.fn(() => ({})),
            "getBindGroupLayout": vi.fn(() => ({}))
        },
        "textureManager": {
            "createSampler": vi.fn(() => ({}))
        },
        "frameTextures": []
    }) as any;

    const createMockBufferManager = () => ({
        "acquireAndWriteUniformBuffer": vi.fn(() => ({}))
    }) as any;

    beforeEach(() =>
    {
        vi.clearAllMocks();
        mockPassEncoder.setPipeline.mockClear();
        mockPassEncoder.setBindGroup.mockClear();
        mockPassEncoder.draw.mockClear();
        mockPassEncoder.end.mockClear();
    });

    it("execute test case1 - blend only (no filter)", () =>
    {
        const config = createMockConfig();
        const bufferManager = createMockBufferManager();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        execute(
            mockAttachment as any,
            mockMainAttachment as any,
            "temp",
            "normal",
            matrix,
            colorTransform,
            false, null, null,
            "", "",
            800, 600,
            config,
            bufferManager
        );

        // Should copy region and draw to main
        expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
    });

    it("execute test case2 - with filter (blur)", () =>
    {
        const config = createMockConfig();
        const bufferManager = createMockBufferManager();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([-5, -5, 110, 110]);
        // BlurFilter: type=1, blurX=4, blurY=4, quality=1
        const filterParams = new Float32Array([1, 4, 4, 1]);

        execute(
            mockAttachment as any,
            mockMainAttachment as any,
            "temp",
            "normal",
            matrix,
            colorTransform,
            true, filterBounds, filterParams,
            "uk1", "fk1",
            800, 600,
            config,
            bufferManager
        );

        expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
    });

    it("execute test case3 - non-identity color transform in blend-only mode", () =>
    {
        const config = createMockConfig();
        const bufferManager = createMockBufferManager();

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        // Non-identity color transform
        const colorTransform = new Float32Array([0.5, 0.5, 0.5, 1, 10, 10, 10, 0]);

        execute(
            mockAttachment as any,
            mockMainAttachment as any,
            "temp",
            "normal",
            matrix,
            colorTransform,
            false, null, null,
            "", "",
            800, 600,
            config,
            bufferManager
        );

        // Should apply color transform (extra createTemporaryAttachment call)
        expect(config.frameBufferManager.createTemporaryAttachment).toHaveBeenCalled();
        expect(config.frameBufferManager.releaseTemporaryAttachment).toHaveBeenCalled();
    });

    it("execute test case4 - caches filter result with uniqueKey", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const config = createMockConfig();
        const bufferManager = createMockBufferManager();

        const matrix = new Float32Array([1, 0, 0, 1, 0, 0]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([0, 0, 100, 100]);
        const filterParams = new Float32Array([1, 2, 2, 1]); // BlurFilter

        execute(
            mockAttachment as any,
            mockMainAttachment as any,
            "temp",
            "normal",
            matrix,
            colorTransform,
            true, filterBounds, filterParams,
            "cacheKey", "filterKey",
            800, 600,
            config,
            bufferManager
        );

        expect($cacheStore.set).toHaveBeenCalledWith("cacheKey", "fKey", "filterKey");
        expect($cacheStore.set).toHaveBeenCalledWith("cacheKey", "fTexture", expect.anything());
    });
});
