import { execute } from "./CaptureToCanvasUseCase";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { DisplayObject } from "@next2d/display";
import { $player } from "../../Player";

vi.mock("@next2d/display", () => ({
    stage: {
        stageWidth: 240,
        stageHeight: 240,
        rendererScale: 1,
        rendererWidth: 240,
        rendererHeight: 240
    }
}));

vi.mock("../../Player", () => ({
    $player: {
        stopFlag: false,
        rendererWidth: 240,
        rendererHeight: 240,
        rendererScale: 1,
        stop: vi.fn(),
        play: vi.fn()
    }
}));

vi.mock("../../Player/service/PlayerResizePostMessageService", () => ({
    execute: vi.fn()
}));

vi.mock("../../Player/service/PlayerTransferCanvasPostMessageService", () => ({
    execute: vi.fn(async () => {})
}));

vi.mock("../service/VideoSyncService", () => ({
    execute: vi.fn(async () => {})
}));

vi.mock("@next2d/cache", () => ({
    $cacheStore: {
        getCanvas: vi.fn(() => document.createElement("canvas"))
    }
}));

describe("CaptureToCanvasUseCase.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("execute test case1 - basic capture", async () =>
    {
        const mockDisplayObject = {
            width: 100,
            height: 100
        } as unknown as DisplayObject;

        const canvas = await execute(mockDisplayObject);

        expect(canvas).toBeInstanceOf(HTMLCanvasElement);
        expect(canvas.width).toBe(100);
        expect(canvas.height).toBe(100);
    });

    it("execute test case2 - capture with custom canvas", async () =>
    {
        const mockDisplayObject = {
            width: 200,
            height: 150
        } as unknown as DisplayObject;

        const customCanvas = document.createElement("canvas");
        const result = await execute(mockDisplayObject, { canvas: customCanvas });

        expect(result).toBe(customCanvas);
        expect(result.width).toBe(200);
        expect(result.height).toBe(150);
    });

    it("execute test case3 - capture with zero dimensions returns canvas without modification", async () =>
    {
        const mockDisplayObject = {
            width: 0,
            height: 0
        } as unknown as DisplayObject;

        const canvas = await execute(mockDisplayObject);

        expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    });

    it("execute test case4 - player stop and play called", async () =>
    {
        const mockDisplayObject = {
            width: 100,
            height: 100
        } as unknown as DisplayObject;

        await execute(mockDisplayObject);

        expect($player.stop).toHaveBeenCalled();
        expect($player.play).toHaveBeenCalled();
    });
});
