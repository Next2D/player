import { execute } from "./ContextContainerEndLayerUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "set": vi.fn(),
        "get": vi.fn()
    }
}));

vi.mock("../../WebGLUtil", () => ({
    "$context": {
        "drawArraysInstanced": vi.fn(),
        "$mainAttachmentObject": { "width": 800, "height": 600, "label": "layer" },
        "bind": vi.fn(),
        "reset": vi.fn(),
        "globalCompositeOperation": "normal"
    },
    "$devicePixelRatio": 1
}));

vi.mock("./ContextContainerBeginLayerUseCase", () => ({
    "$containerLayerStack": [] as any[]
}));

vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerGetTextureFromBoundsUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600, "textureId": 1 }))
}));

vi.mock("../../FrameBufferManager/usecase/FrameBufferManagerReleaseAttachmentObjectUseCase", () => ({
    "execute": vi.fn()
}));

vi.mock("../../Blend/usecase/BlendDrawFilterToMainUseCase", () => ({
    "execute": vi.fn()
}));

vi.mock("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase", () => ({
    "execute": vi.fn()
}));

vi.mock("../../Filter/BlurFilter/usecase/FilterApplyBlurFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600, "textureId": 2 }))
}));
vi.mock("../../Filter/BevelFilter/usecase/FilterApplyBevelFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/ColorMatrixFilter/usecase/FilterApplyColorMatrixFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/ConvolutionFilter/usecase/FilterApplyConvolutionFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/DisplacementMapFilter/usecase/FilterApplyDisplacementMapFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/DropShadowFilter/usecase/FilterApplyDropShadowFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/GlowFilter/usecase/FilterApplyGlowFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/GradientBevelFilter/usecase/FilterApplyGradientBevelFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter/GradientGlowFilter/usecase/FilterApplyGradientGlowFilterUseCase", () => ({
    "execute": vi.fn(() => ({ "width": 800, "height": 600 }))
}));
vi.mock("../../Filter", () => ({
    "$offset": { "x": 0, "y": 0 }
}));

describe("ContextContainerEndLayerUseCase.js test", () => {

    beforeEach(async () =>
    {
        vi.clearAllMocks();
        const { $containerLayerStack } = await import("./ContextContainerBeginLayerUseCase");
        $containerLayerStack.length = 0;
        $containerLayerStack.push({ "width": 800, "height": 600, "label": "main" } as any);

        const { $context } = await import("../../WebGLUtil");
        $context.$mainAttachmentObject = { "width": 800, "height": 600, "label": "layer" } as any;
    });

    it("execute test case1 - blend only (no filter)", async () =>
    {
        const { $context } = await import("../../WebGLUtil");
        const blendMod = await import("../../Blend/usecase/BlendDrawFilterToMainUseCase");
        const releaseMod = await import("../../TextureManager/usecase/TextureManagerReleaseTextureObjectUseCase");

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);

        execute("normal", matrix, colorTransform, false, null, null, "", "");

        expect($context.drawArraysInstanced).toHaveBeenCalledTimes(1);
        expect($context.reset).toHaveBeenCalledTimes(1);
        expect(blendMod.execute).toHaveBeenCalledTimes(1);
        expect(releaseMod.execute).toHaveBeenCalledTimes(1);
        expect($context.bind).toHaveBeenCalled();
    });

    it("execute test case2 - with filter (blur)", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        const blendMod = await import("../../Blend/usecase/BlendDrawFilterToMainUseCase");
        const blurMod = await import("../../Filter/BlurFilter/usecase/FilterApplyBlurFilterUseCase");

        const matrix = new Float32Array([1, 0, 0, 1, 10, 20]);
        const colorTransform = new Float32Array([1, 1, 1, 1, 0, 0, 0, 0]);
        const filterBounds = new Float32Array([-5, -5, 110, 110]);
        // BlurFilter: type=1, blurX=4, blurY=4, quality=1
        const filterParams = new Float32Array([1, 4, 4, 1]);

        execute("normal", matrix, colorTransform, true, filterBounds, filterParams, "uk1", "fk1");

        expect(blurMod.execute).toHaveBeenCalledTimes(1);
        expect($cacheStore.set).toHaveBeenCalledWith("uk1", "fKey", "fk1");
        expect(blendMod.execute).toHaveBeenCalledTimes(1);
    });
});
