import { execute } from "./PlayerRemoveCachePostMessageService";
import { $cacheStore } from "@next2d/cache";
import { $rendererWorker } from "../../RendererWorker";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@next2d/cache", () => ({
    $cacheStore: {
        $removeIds: []
    }
}));

vi.mock("../../RendererWorker", () => ({
    $rendererWorker: {
        postMessage: vi.fn()
    }
}));

describe("PlayerRemoveCachePostMessageService.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $cacheStore.$removeIds = [];
    });

    it("execute test case1 - remove cache with empty ids", () =>
    {
        execute();

        expect($rendererWorker.postMessage).toHaveBeenCalled();
        expect($cacheStore.$removeIds.length).toBe(0);
    });

    it("execute test case2 - remove cache with ids", () =>
    {
        $cacheStore.$removeIds = [1, 2, 3, 4, 5];

        execute();

        expect($rendererWorker.postMessage).toHaveBeenCalled();
        expect($cacheStore.$removeIds.length).toBe(0);
        
        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        expect(calls.length).toBe(1);
        expect(calls[0][0].command).toBe("removeCache");
        expect(calls[0][0].buffer).toBeInstanceOf(Float32Array);
    });

    it("execute test case3 - verify message structure", () =>
    {
        $cacheStore.$removeIds = [10, 20, 30];

        execute();

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const message = calls[0][0];
        const options = calls[0][1];

        expect(message.command).toBe("removeCache");
        expect(message.buffer).toBeInstanceOf(Float32Array);
        expect(options).toBeInstanceOf(Array);
        expect(options[0]).toBeInstanceOf(ArrayBuffer);
    });
});
