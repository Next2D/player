import { execute } from "./DisplayObjectContainerRenderUseCase";
import { describe, expect, it, vi } from "vitest";

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "drawArraysInstanced": vi.fn(),
        "save": vi.fn(),
        "restore": vi.fn(),
        "beginMask": vi.fn(),
        "endMask": vi.fn(),
        "leaveMask": vi.fn(),
        "setMaskBounds": vi.fn(),
        "containerBeginLayer": vi.fn(),
        "containerEndLayer": vi.fn(),
        "containerDrawCachedFilter": vi.fn(),
        "globalAlpha": 1,
        "imageSmoothingEnabled": true,
        "globalCompositeOperation": "normal"
    }
}));

vi.mock("../../Shape/usecase/ShapeRenderUseCase", () => ({
    "execute": vi.fn((_rq: Float32Array, index: number) => index)
}));

vi.mock("../../Shape/usecase/ShapeClipRenderUseCase", () => ({
    "execute": vi.fn((_rq: Float32Array, index: number) => index)
}));

vi.mock("../../TextField/usecase/TextFieldRenderUseCase", () => ({
    "execute": vi.fn((_rq: Float32Array, index: number) => index)
}));

vi.mock("../../Video/usecase/VideoRenderUseCase", () => ({
    "execute": vi.fn((_rq: Float32Array, index: number) => index)
}));

vi.mock("./DisplayObjectContainerClipRenderUseCase", () => ({
    "execute": vi.fn((_rq: Float32Array, index: number) => index)
}));

vi.mock("../../DisplayObject/service/DisplayObjectGetBlendModeService", () => ({
    "execute": vi.fn(() => "normal")
}));

describe("DisplayObjectContainerRenderUseCase.js test", () => {

    it("execute test case1 - simple container no layer, no mask, no children", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.containerBeginLayer).mockClear();
        vi.mocked($context.containerEndLayer).mockClear();

        const data: number[] = [];
        // blendMode
        data.push(0);
        // useLayer = false
        data.push(0);
        // useMaskDisplayObject = false
        data.push(0);
        // children length = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.containerBeginLayer).not.toHaveBeenCalled();
        expect($context.containerEndLayer).not.toHaveBeenCalled();
        expect(result).toBe(data.length);
    });

    it("execute test case2 - container with useLayer and blend only", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.containerBeginLayer).mockClear();
        vi.mocked($context.containerEndLayer).mockClear();

        const data: number[] = [];
        // blendMode
        data.push(0);
        // useLayer = true
        data.push(1);
        // layerWidth, layerHeight
        data.push(800, 600);
        // useFilter = false
        data.push(0);
        // matrix (6)
        data.push(1, 0, 0, 1, 0, 0);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // useMaskDisplayObject = false
        data.push(0);
        // children length = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.containerBeginLayer).toHaveBeenCalledWith(800, 600);
        expect($context.containerEndLayer).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case3 - container with filter cache hit returns early", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.containerDrawCachedFilter).mockClear();

        const data: number[] = [];
        // blendMode
        data.push(0);
        // useLayer = true
        data.push(1);
        // layerWidth, layerHeight
        data.push(800, 600);
        // useFilter = true
        data.push(1);
        // filterCache = true
        data.push(1);
        // uniqueKey
        data.push(42);
        // filterKey
        data.push(99);
        // filterBounds (4)
        data.push(-10, -10, 110, 110);
        // matrix (6)
        data.push(1, 0, 0, 1, 0, 0);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.containerDrawCachedFilter).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });
});
