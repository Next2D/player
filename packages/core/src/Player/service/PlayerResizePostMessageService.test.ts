import { execute } from "./PlayerResizePostMessageService";
import { $player } from "../../Player";
import { $rendererWorker } from "../../RendererWorker";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../Player", () => ({
    $player: {
        rendererWidth: 800,
        rendererHeight: 600,
        rendererScale: 1
    }
}));

vi.mock("../../RendererWorker", () => ({
    $rendererWorker: {
        postMessage: vi.fn()
    }
}));

describe("PlayerResizePostMessageService.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $player.rendererWidth = 800;
        $player.rendererHeight = 600;
    });

    it("execute test case1 - resize with default cache clear", () =>
    {
        execute();

        expect($rendererWorker.postMessage).toHaveBeenCalled();
        
        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const message = calls[0][0];
        
        expect(message.command).toBe("resize");
        expect(message.buffer).toBeInstanceOf(Float32Array);
        expect(message.buffer[0]).toBe(800);
        expect(message.buffer[1]).toBe(600);
        expect(message.buffer[2]).toBe(1);
    });

    it("execute test case2 - resize with cache clear false", () =>
    {
        execute(false);

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const message = calls[0][0];
        
        expect(message.buffer[0]).toBe(800);
        expect(message.buffer[1]).toBe(600);
        expect(message.buffer[2]).toBe(0);
    });

    it("execute test case3 - resize with cache clear true", () =>
    {
        execute(true);

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const message = calls[0][0];
        
        expect(message.buffer[2]).toBe(1);
    });

    it("execute test case4 - verify transferable options", () =>
    {
        execute();

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const options = calls[0][1];
        
        expect(options).toBeInstanceOf(Array);
        expect(options[0]).toBeInstanceOf(ArrayBuffer);
    });

    it("execute test case5 - different dimensions", () =>
    {
        $player.rendererWidth = 1024;
        $player.rendererHeight = 768;

        execute();

        const calls = vi.mocked($rendererWorker.postMessage).mock.calls;
        const message = calls[0][0];
        
        expect(message.buffer[0]).toBe(1024);
        expect(message.buffer[1]).toBe(768);
    });
});
