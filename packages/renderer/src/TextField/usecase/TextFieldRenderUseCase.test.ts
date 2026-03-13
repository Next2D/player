import { execute } from "./TextFieldRenderUseCase";
import { describe, expect, it, vi } from "vitest";

const mockNode = { "x": 0, "y": 0, "w": 100, "h": 50 };

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "get": vi.fn(() => mockNode),
        "set": vi.fn(),
        "has": vi.fn(() => false)
    }
}));

vi.mock("../../RendererUtil", () => ({
    "$context": {
        "reset": vi.fn(),
        "setTransform": vi.fn(),
        "createNode": vi.fn(() => mockNode),
        "beginNodeRendering": vi.fn(),
        "endNodeRendering": vi.fn(),
        "drawElement": vi.fn(),
        "drawDisplayObject": vi.fn(),
        "bind": vi.fn(),
        "applyFilter": vi.fn(),
        "currentAttachmentObject": null,
        "atlasAttachmentObject": null,
        "globalAlpha": 1,
        "imageSmoothingEnabled": true,
        "globalCompositeOperation": "normal"
    }
}));

vi.mock("./TextFieldDrawOffscreenCanvasUseCase", () => ({
    "execute": vi.fn(() => new OffscreenCanvas(100, 50))
}));

vi.mock("../../DisplayObject/service/DisplayObjectGetBlendModeService", () => ({
    "execute": vi.fn(() => "normal")
}));

describe("TextFieldRenderUseCase.js test", () => {

    it("execute test case1 - render with cache hit", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.drawDisplayObject).mockClear();

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 10, 20);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 50);
        // baseBounds (4)
        data.push(0, 0, 100, 50);
        // uniqueKey, cacheKey
        data.push(1, 0);
        // changed
        data.push(0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(1);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case2 - render with filter", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.applyFilter).mockClear();

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 10, 20);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 50);
        // baseBounds (4)
        data.push(0, 0, 100, 50);
        // uniqueKey, cacheKey
        data.push(5, 0);
        // changed
        data.push(1);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(5);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 1
        data.push(1);
        // updated
        data.push(1);
        // filterBounds (4)
        data.push(-5, -5, 110, 60);
        // filter params length
        data.push(3);
        // filter params
        data.push(1, 2, 1);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        expect($context.applyFilter).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case3 - cache miss returns early when no node", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        vi.mocked($cacheStore.get).mockReturnValueOnce(null as any);

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 10, 20);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 50);
        // baseBounds (4)
        data.push(0, 0, 100, 50);
        // uniqueKey, cacheKey
        data.push(99, 0);
        // changed
        data.push(0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(99);
        // hasCache = 1
        data.push(1);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0);

        // Should return early at hasCache position + 1
        expect(result).toBe(data.length);
    });
});
