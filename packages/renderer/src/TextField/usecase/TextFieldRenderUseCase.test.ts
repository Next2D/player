import { execute } from "./TextFieldRenderUseCase";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { $context } from "../../RendererUtil";
import { execute as drawText } from "./TextFieldDrawOffscreenCanvasUseCase";

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

    beforeEach(() => {
        vi.clearAllMocks();
    });

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
        expect($context.drawDisplayObject).toHaveBeenCalledWith(
            mockNode, 0, 0, 100, 50, renderQueue, 6
        );
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

describe("TextField color transform queue offset", () => {
    const color = [0.25, -0, 0.75, 0.5, 16, -32, 48, 64];
    const header = (flag: number, alpha: number, additive: number): number[] => [
        2, 0, 0, 3, 10, 20,
        ...color.slice(0, 3), alpha, ...color.slice(4, 7), additive,
        8, 14, 208, 164,
        -1, -2, 99, 48,
        1, 0, flag, 2, 3, 1
    ];
    // Exercise both a nonzero view byteOffset and a nonzero parser index.
    const queue = (data: number[]): Float32Array => {
        const backing = new Float32Array(data.length + 12);
        const view = backing.subarray(5);
        view.set(data, 3);
        return view;
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it.each([0, 2])("passes the original queue for cached text, flag=%i", flag => {
        const data = [...header(flag, 0.5, 64), 1, 0, 0];
        const input = queue(data);
        const subarray = vi.spyOn(input, "subarray");
        expect(execute(input, 3)).toBe(3 + data.length);
        expect($context.drawDisplayObject).toHaveBeenCalledWith(
            mockNode, 8, 14, 208, 164, input, 9
        );
        expect($context.globalAlpha).toBe(0.5 + 64 / 255);
        expect(subarray.mock.calls).toEqual([[3, 9], [17, 21]]);
        expect($context.applyFilter).not.toHaveBeenCalled();
        expect($context.setTransform).toHaveBeenLastCalledWith(
            1, 0, 0, 1, 8, 14
        );
    });

    it.each([
        [0.5, 64, 0.5 + 64 / 255],
        [-0.5, 0, 0], [2, 0, 1], [-0, -0, 0], [NaN, 0, NaN]
    ])("preserves alpha clamping for %s + %s / 255", (alpha, additive, expected) => {
        const input = queue([...header(0, alpha, additive), 1, 0, 0]);
        execute(input, 3);
        expect(Object.is($context.globalAlpha, expected)).toBe(true);
    });

    it("keeps eight-element filter views tied to each input queue", () => {
        const data = [...header(1, 0.5, 64), 1, 0, 1, 1, -5, -5, 110, 60, 3, 1, 2, 1];
        const first = queue(data);
        const second = queue(data);
        second[9] = 0.875;
        const subarray = vi.spyOn(first, "subarray");
        expect(execute(first, 3)).toBe(data.length + 3);
        expect(execute(second, 3)).toBe(data.length + 3);
        const calls = vi.mocked($context.applyFilter).mock.calls;
        expect(calls).toHaveLength(2);
        expect(Array.from(calls[0][7])).toEqual(color);
        expect(calls[0][7].length).toBe(8);
        expect(calls[0][7].buffer).toBe(first.buffer);
        expect(calls[0][7].byteOffset).toBe(first.byteOffset + 9 * 4);
        expect(calls[1][7].buffer).toBe(second.buffer);
        expect(calls[1][7][0]).toBe(0.875);
        expect(calls[0][7][0]).toBe(0.25);
        expect(subarray).toHaveBeenCalledTimes(5);
        expect($context.drawDisplayObject).not.toHaveBeenCalled();
    });

    it("forwards the offset after rasterizing packed text on a cache miss", () => {
        // hasCache=0, hasNode=1, four UTF-8 bytes packed into one float.
        const data = [...header(1, 0.5, 64), 0, 1, 4, 0,
            2, -1, 0, 0, 100, 50, 100, 50, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
            0, 0];
        const input = queue(data);
        new Uint8Array(input.buffer, input.byteOffset + (3 + 31) * 4, 4)
            .set(new TextEncoder().encode("null"));
        vi.mocked(drawText).mockReturnValueOnce({} as OffscreenCanvas);
        expect(execute(input, 3)).toBe(data.length + 3);
        expect(vi.mocked(drawText).mock.calls[0].slice(0, 4)).toEqual([null, expect.objectContaining({
            "width": 200, "height": 150, "autoSize": "none"
        }), 2, 3]);
        expect($context.drawDisplayObject).toHaveBeenCalledWith(
            mockNode, 8, 14, 208, 164, input, 9
        );
    });

    it("reuses only the last small canvas after its upload and drops oversized rasters", () => {
        const data = [...header(1, 0.5, 64), 0, 1, 4, 0,
            2, -1, 0, 0, 100, 50, 100, 50, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
            0, 0];
        const input = queue(data);
        new Uint8Array(input.buffer, input.byteOffset + (3 + 31) * 4, 4)
            .set(new TextEncoder().encode("null"));
        const first = { width: 200, height: 150 } as OffscreenCanvas;
        const large = { width: 8192, height: 150 } as OffscreenCanvas;
        vi.mocked(drawText).mockReturnValueOnce(first).mockReturnValueOnce(first)
            .mockReturnValueOnce(large).mockReturnValueOnce(first);
        execute(input, 3);
        execute(input, 3);
        expect(vi.mocked(drawText).mock.calls[1][4]).toBe(first);
        expect(vi.mocked($context.drawElement).mock.invocationCallOrder[0])
            .toBeLessThan(vi.mocked(drawText).mock.invocationCallOrder[1]);
        input[3 + 20] = 4095; // base xMax: 8192 scaled pixels
        execute(input, 3);
        input[3 + 20] = 99;
        execute(input, 3);
        expect(vi.mocked(drawText).mock.calls[3][4]).toBeNull();
    });
    it.each([true, false])("preserves queue offsets and scratch ordering when batching accepts=%s", accepts => {
        const data = [...header(1, 0.5, 64), 0, 1, 4, 0,
            2, -1, 0, 0, 100, 50, 100, 50, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10,
            0, 0];
        const input = queue(data);
        new Uint8Array(input.buffer, input.byteOffset + (3 + 31) * 4, 4)
            .set(new TextEncoder().encode("null"));
        const canvas = { width: 200, height: 150 } as OffscreenCanvas;
        vi.mocked(drawText).mockReturnValue(canvas);
        const enqueue = vi.fn(() => accepts);
        Reflect.set($context, "queueTextElement", enqueue);
        try {
            expect(execute(input, 3)).toBe(data.length + 3);
            expect(execute(input, 3)).toBe(data.length + 3);
            expect(enqueue).toHaveBeenCalledTimes(2);
            expect(enqueue).toHaveBeenCalledWith(mockNode, canvas);
            expect(enqueue.mock.invocationCallOrder[0]).toBeLessThan(vi.mocked(drawText).mock.invocationCallOrder[1]);
            expect(vi.mocked(drawText).mock.calls[1][4]).toBe(canvas);
            expect($context.drawElement).toHaveBeenCalledTimes(accepts ? 0 : 2);
            expect($context.beginNodeRendering).toHaveBeenCalledTimes(accepts ? 0 : 2);
            expect($context.drawDisplayObject).toHaveBeenLastCalledWith(mockNode, 8, 14, 208, 164, input, 9);
        } finally {
            Reflect.deleteProperty($context, "queueTextElement");
        }
    });

});
