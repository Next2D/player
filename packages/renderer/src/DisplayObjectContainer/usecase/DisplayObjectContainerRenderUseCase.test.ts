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
        "containerBeginAtlasNode": vi.fn(() => ({ "x": 0, "y": 0, "w": 100, "h": 80, "index": 0 })),
        "containerEndAtlasNode": vi.fn(),
        "containerDrawCachedFilter": vi.fn(),
        "removeNode": vi.fn(),
        "setTransform": vi.fn(),
        "drawDisplayObject": vi.fn(),
        "globalAlpha": 1,
        "imageSmoothingEnabled": true,
        "globalCompositeOperation": "normal"
    }
}));

vi.mock("@next2d/cache", () => ({
    "$cacheStore": {
        "get": vi.fn(() => null),
        "set": vi.fn()
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
        // layerScaleX, layerScaleY (2)
        data.push(1, 1);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        expect($context.containerDrawCachedFilter).toHaveBeenCalledTimes(1);
        expect(result).toBe(data.length);
    });

    it("execute test case4 - cacheAsBitmap cache hit returns early", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        const { $cacheStore } = await import("@next2d/cache");
        vi.mocked($context.containerBeginLayer).mockClear();
        vi.mocked($context.containerEndLayer).mockClear();
        vi.mocked($context.drawDisplayObject).mockClear();
        vi.mocked($context.setTransform).mockClear();

        // キャッシュされたノードを返すようにモック
        const mockNode = { "x": 0, "y": 0, "w": 100, "h": 80, "index": 0 };
        vi.mocked($cacheStore.get).mockReturnValueOnce(mockNode as any);

        const data: number[] = [];
        // blendMode
        data.push(0);
        // useLayer = true
        data.push(1);
        // layerWidth, layerHeight
        data.push(0, 0);
        // layerType = 2 (cacheAsBitmap)
        data.push(2);
        // cacheHit = true
        data.push(1);
        // uniqueKey (instanceId)
        data.push(10);
        // cacheKey
        data.push(500);
        // filterBounds (4)
        data.push(0, 0, 100, 80);
        // renderScaleX, renderScaleY
        data.push(1, 1);
        // parent matrix a, b, c, d, screenX, screenY
        data.push(1, 0, 0, 1, 30, 40);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        // cache hit → drawDisplayObject でアトラスから描画して即return
        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        // matrix/renderScale = 1/1 → setTransform(1, 0, 0, 1, 30, 40)
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 30, 40);
        // containerBeginLayer/EndLayerは呼ばれない（子要素の描画不要）
        expect($context.containerBeginLayer).not.toHaveBeenCalled();
        expect($context.containerEndLayer).not.toHaveBeenCalled();
        expect(result).toBe(data.length);
    });

    it("execute test case5 - cacheAsBitmap cache miss processes children and caches", async () =>
    {
        const { $context } = await import("../../RendererUtil");
        const { $cacheStore } = await import("@next2d/cache");
        vi.mocked($context.containerBeginLayer).mockClear();
        vi.mocked($context.containerEndLayer).mockClear();
        vi.mocked($context.containerBeginAtlasNode).mockClear();
        vi.mocked($context.containerEndAtlasNode).mockClear();
        vi.mocked($context.drawDisplayObject).mockClear();
        vi.mocked($context.setTransform).mockClear();
        vi.mocked($context.removeNode).mockClear();
        vi.mocked($cacheStore.get).mockReturnValue(null as any);
        vi.mocked($cacheStore.set).mockClear();

        const mockNode = { "x": 0, "y": 0, "w": 100, "h": 80, "index": 0 };
        vi.mocked($context.containerBeginAtlasNode).mockReturnValueOnce(mockNode as any);

        const data: number[] = [];
        // blendMode
        data.push(0);
        // useLayer = true
        data.push(1);
        // layerWidth, layerHeight
        data.push(100, 80);
        // layerType = 2 (cacheAsBitmap)
        data.push(2);
        // cacheHit = false
        data.push(0);
        // uniqueKey (instanceId)
        data.push(10);
        // cacheKey
        data.push(500);
        // filterBounds (4)
        data.push(0, 0, 100, 80);
        // renderScaleX, renderScaleY
        data.push(1, 1);
        // parent matrix a, b, c, d, screenX, screenY
        data.push(1, 0, 0, 1, 30, 40);
        // colorTransform (8)
        data.push(1, 1, 1, 1, 0, 0, 0, 0);
        // paramsLength = 0 (no filter params)
        data.push(0);
        // useMaskDisplayObject = false
        data.push(0);
        // children length = 0
        data.push(0);

        const renderQueue = new Float32Array(data);
        const result = execute(renderQueue, 0, null);

        // cache miss → containerBeginAtlasNode → 子要素描画 → containerEndAtlasNode
        expect($context.containerBeginAtlasNode).toHaveBeenCalledWith(100, 80);
        expect($context.containerEndAtlasNode).toHaveBeenCalledTimes(1);
        // containerBeginLayer/containerEndLayer は呼ばれない（直接アトラス描画）
        expect($context.containerBeginLayer).not.toHaveBeenCalled();
        expect($context.containerEndLayer).not.toHaveBeenCalled();
        // ノードをキャッシュに保存
        expect($cacheStore.set).toHaveBeenCalledWith("10", "bNode", mockNode);
        expect($cacheStore.set).toHaveBeenCalledWith("10", "bKey", "500");
        // アトラスからインスタンス描画
        expect($context.drawDisplayObject).toHaveBeenCalledTimes(1);
        // matrix/renderScale = 1/1 → setTransform(1, 0, 0, 1, 30, 40)
        expect($context.setTransform).toHaveBeenCalledWith(1, 0, 0, 1, 30, 40);
        expect(result).toBe(data.length);
    });
});
