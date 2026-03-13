import { execute } from "./VideoRenderUseCase";
import { describe, expect, it, vi } from "vitest";

const mockNode = { "x": 0, "y": 0, "w": 320, "h": 240 };

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

vi.mock("../../DisplayObject/service/DisplayObjectGetBlendModeService", () => ({
    "execute": vi.fn(() => "normal")
}));

describe("VideoRenderUseCase.js test", () => {

    it("execute test case1 - render with cache hit", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.drawDisplayObject).mockClear();
        vi.mocked($context.setTransform).mockClear();

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 320, 240);
        // baseBounds (4)
        data.push(0, 0, 320, 240);
        // uniqueKey
        data.push(1);
        // changed
        data.push(0);
        // filterKey
        data.push(1);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 50, 60);
        expect(result).toBe(data.length);
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
        data.push(0, 0, 320, 240);
        // baseBounds (4)
        data.push(0, 0, 320, 240);
        // uniqueKey
        data.push(3);
        // changed
        data.push(1);
        // filterKey
        data.push(3);
        // hasCache = 1
        data.push(1);
        // blendMode
        data.push(0);
        // useFilter = 1
        data.push(1);
        // updated
        data.push(1);
        // filterBounds (4)
        data.push(-5, -5, 330, 250);
        // filter params length
        data.push(3);
        // filter params
        data.push(1, 2, 1);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.applyFilter).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case3 - no cache, with image bitmap", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        vi.mocked($context.drawElement).mockClear();
        vi.mocked($context.beginNodeRendering).mockClear();
        vi.mocked($context.endNodeRendering).mockClear();

        const mockBitmap = { "width": 320, "height": 240 } as unknown as ImageBitmap;

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 50, 60);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 320, 240);
        // baseBounds (4)
        data.push(0, 0, 320, 240);
        // uniqueKey
        data.push(10);
        // changed
        data.push(1);
        // filterKey
        data.push(10);
        // hasCache = 0
        data.push(0);
        // hasNode = 0
        data.push(0);
        // blendMode
        data.push(0);
        // useFilter = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, [mockBitmap]);

        expect($context.beginNodeRendering).toHaveBeenCalledTimes(1);
        expect($context.drawElement).toHaveBeenCalledWith(mockNode, mockBitmap, true);
        expect($context.endNodeRendering).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case4 - cache miss returns early when no node found", async () =>
    {
        const { $cacheStore } = await import("@next2d/cache");
        vi.mocked($cacheStore.get).mockReturnValueOnce(null as any);

        const data: number[] = [];
        // matrix (6)
        data.push(1, 0, 0, 1, 0, 0);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // bounds (4)
        data.push(0, 0, 320, 240);
        // baseBounds (4)
        data.push(0, 0, 320, 240);
        // uniqueKey
        data.push(99);
        // changed
        data.push(0);
        // filterKey
        data.push(99);
        // hasCache = 1
        data.push(1);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect(result).toBe(data.length);
    });
});
