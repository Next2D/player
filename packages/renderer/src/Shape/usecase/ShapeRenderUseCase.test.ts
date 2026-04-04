import { execute } from "./ShapeRenderUseCase";
import { describe, expect, it, vi } from "vitest";

const mockNode = { "x": 0, "y": 0, "w": 100, "h": 100 };

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
        "useGrid": vi.fn(),
        "createNode": vi.fn(() => mockNode),
        "beginNodeRendering": vi.fn(),
        "endNodeRendering": vi.fn(),
        "drawFill": vi.fn(),
        "drawPixels": vi.fn(),
        "drawDisplayObject": vi.fn(),
        "drawArraysInstanced": vi.fn(),
        "bind": vi.fn(),
        "applyFilter": vi.fn(),
        "currentAttachmentObject": null,
        "atlasAttachmentObject": null,
        "globalAlpha": 1,
        "imageSmoothingEnabled": true,
        "globalCompositeOperation": "normal"
    }
}));

vi.mock("../service/ShapeCommandService", () => ({
    "execute": vi.fn()
}));

vi.mock("../../DisplayObject/service/DisplayObjectGetBlendModeService", () => ({
    "execute": vi.fn(() => "normal")
}));

describe("ShapeRenderUseCase.js test", () => {

    it("execute test case1 - render with cache hit", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.drawDisplayObject).mockClear();
        vi.mocked($context.setTransform).mockClear();

        // Build render queue for cached shape
        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 100);
        // baseBounds xMin, yMin, xMax, yMax
        data.push(0, 0, 100, 100);
        // isGridEnabled, isDrawable, isBitmap
        data.push(0, 1, 0);
        // uniqueKey, cacheKey
        data.push(1, 0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(1);
        // hasCache = 1 (cached)
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const resultIndex = execute(renderQueue, 0);

        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(data.length);
    });

    it("execute test case2 - render with filter", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.applyFilter).mockClear();

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 100, 100);
        // baseBounds
        data.push(0, 0, 100, 100);
        // isGridEnabled, isDrawable, isBitmap
        data.push(0, 1, 0);
        // uniqueKey, cacheKey
        data.push(2, 0);
        // xScale, yScale
        data.push(1, 1);
        // filterKey
        data.push(2);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 1
        data.push(1);
        // updated
        data.push(1);
        // filterBounds (4)
        data.push(-5, -5, 110, 110);
        // filter params length
        data.push(3);
        // filter params
        data.push(1, 2, 1);

        const renderQueue = new Float32Array(data);
        const resultIndex = execute(renderQueue, 0);

        expect($context.applyFilter).toHaveBeenCalledTimes(1);
        expect(resultIndex).toBe(data.length);
    });
});
