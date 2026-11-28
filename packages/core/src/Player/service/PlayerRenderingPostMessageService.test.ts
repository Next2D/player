import { execute, $COLOR_ARRAY_IDENTITY, $rendererReady } from "./PlayerRenderingPostMessageService";
import { $rendererWorker } from "../../RendererWorker";
import { stage } from "@next2d/display";
import { renderQueue } from "@next2d/render-queue";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@next2d/display", () => ({
    stage: {
        $generateRenderQueue: vi.fn()
    }
}));

vi.mock("../../RendererWorker", () => ({
    $rendererWorker: {
        postMessage: vi.fn(),
        addEventListener: vi.fn()
    }
}));

vi.mock("@next2d/render-queue", () => ({
    renderQueue: {
        trim: vi.fn(),
        offset: 0,
        buffer: new Float32Array(1024)
    }
}));

vi.mock("../../CoreUtil", () => ({
    $renderMatrix: new Float32Array([1, 0, 0, 1, 0, 0])
}));

describe("PlayerRenderingPostMessageService.js test", () =>
{
    // モジュールの読み込み時に登録された、ワーカーからの受け取り
    const onMessage = vi.mocked($rendererWorker.addEventListener).mock.calls[0][1] as (event: MessageEvent) => void;

    it("$rendererReady resolves when the renderer reports that its initialization finished", async () =>
    {
        let ready = false;
        const promise = $rendererReady.then((): void => { ready = true; });

        // 描画の返事では解決しない
        onMessage({ "data": { "message": "render", "buffer": new Float32Array(1) } } as MessageEvent);
        await Promise.resolve();
        expect(ready).toBe(false);

        // 初期化の最後に届く合図で解決する
        onMessage({ "data": { "message": "renderFlowControl", "enabled": true } } as MessageEvent);
        await promise;
        expect(ready).toBe(true);

        // 2 回目の合図でも問題ない
        onMessage({ "data": { "message": "renderFlowControl", "enabled": true } } as MessageEvent);
        await $rendererReady;
    });

    beforeEach(() => {
        vi.clearAllMocks();
        renderQueue.offset = 0;
    });

    it("execute test case1 - no rendering when offset is 0", () =>
    {
        renderQueue.offset = 0;

        execute();

        expect(stage.$generateRenderQueue).toHaveBeenCalled();
        expect($rendererWorker.postMessage).not.toHaveBeenCalled();
    });

    it("execute test case2 - render with offset", () =>
    {
        // Mock $generateRenderQueue to set offset after it's called
        vi.mocked(stage.$generateRenderQueue).mockImplementation(() => {
            renderQueue.offset = 100;
        });

        execute();

        expect(stage.$generateRenderQueue).toHaveBeenCalled();
        expect($rendererWorker.postMessage).toHaveBeenCalled();
    });

    it("execute test case3 - verify message structure without imageBitmaps", () =>
    {
        // Mock $generateRenderQueue to set offset after it's called
        vi.mocked(stage.$generateRenderQueue).mockImplementation(() => {
            renderQueue.offset = 50;
        });

        execute();

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        expect(calls.length).toBe(1);
        
        const message = calls[0][0];
        expect(message.command).toBe("render");
        expect(message.buffer).toBeInstanceOf(Float32Array);
        expect(message.length).toBe(50);
        expect(message.imageBitmaps).toBe(null);
    });

    it("execute test case4 - verify COLOR_ARRAY_IDENTITY", () =>
    {
        expect($COLOR_ARRAY_IDENTITY).toBeInstanceOf(Float32Array);
        expect($COLOR_ARRAY_IDENTITY.length).toBe(8);
        expect($COLOR_ARRAY_IDENTITY[0]).toBe(1);
        expect($COLOR_ARRAY_IDENTITY[1]).toBe(1);
        expect($COLOR_ARRAY_IDENTITY[2]).toBe(1);
        expect($COLOR_ARRAY_IDENTITY[3]).toBe(1);
    });
});
