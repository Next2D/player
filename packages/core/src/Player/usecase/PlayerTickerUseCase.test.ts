import { execute } from "./PlayerTickerUseCase";
import { $player } from "../../Player";
import { stage } from "@next2d/display";
import { $cacheStore } from "@next2d/cache";
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../Player", () => ({
    $player: {
        stopFlag: false,
        startTime: 0,
        fps: 16.666,
        timerId: -1
    }
}));

vi.mock("@next2d/display", () => ({
    stage: {
        changed: false,
        $ticker: vi.fn(),
        hasEventListener: vi.fn(() => false),
        dispatchEvent: vi.fn()
    }
}));

vi.mock("@next2d/cache", () => ({
    $cacheStore: {
        $removeIds: [],
        $removeCache: false,
        removeTimerScheduledCache: vi.fn()
    }
}));

vi.mock("@next2d/events", () => ({
    Event: class MockEvent {
        static ENTER_FRAME = "enterFrame";
        constructor(public type: string) {}
    }
}));

vi.mock("../service/PlayerRenderingPostMessageService", () => ({
    execute: vi.fn()
}));

vi.mock("../service/PlayerRemoveCachePostMessageService", () => ({
    execute: vi.fn()
}));

describe("PlayerTickerUseCase.js test", () =>
{
    beforeEach(() => {
        vi.clearAllMocks();
        $player.stopFlag = false;
        $player.startTime = 0;
        $player.fps = 16.666;
        $player.timerId = -1;
        stage.changed = false;
        $cacheStore.$removeIds = [];
        $cacheStore.$removeCache = false;
        
        global.requestAnimationFrame = vi.fn((callback) => {
            return 1;
        }) as any;
    });

    it("execute test case1 - return early when stopped", async () =>
    {
        $player.stopFlag = true;

        execute(16.666);

        expect(stage.$ticker).not.toHaveBeenCalled();
    });

    it("execute test case2 - execute ticker when time elapsed", async () =>
    {
        $player.stopFlag = false;
        $player.startTime = 0;

        execute(20);

        expect(stage.$ticker).toHaveBeenCalled();
    });

    it("execute test case3 - skip ticker when time not elapsed", async () =>
    {
        $player.stopFlag = false;
        $player.startTime = 0;

        execute(5);

        expect(stage.$ticker).not.toHaveBeenCalled();
        expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it("execute test case4 - dispatch enter frame event when has listener", async () =>
    {
        $player.stopFlag = false;
        $player.startTime = 0;
        vi.mocked(stage.hasEventListener).mockReturnValue(true);

        execute(20);

        expect(stage.dispatchEvent).toHaveBeenCalled();
    });

    it("execute test case5 - render when stage changed", async () =>
    {
        const { execute: playerRenderingPostMessageService } = await import("../service/PlayerRenderingPostMessageService");
        
        $player.stopFlag = false;
        $player.startTime = 0;
        stage.changed = true;

        execute(20);

        expect(playerRenderingPostMessageService).toHaveBeenCalled();
    });

    it("execute test case6 - remove cache when ids present", async () =>
    {
        const { execute: playerRemoveCachePostMessageService } = await import("../service/PlayerRemoveCachePostMessageService");
        
        $player.stopFlag = false;
        $cacheStore.$removeIds = [1, 2, 3];

        execute(20);

        expect(playerRemoveCachePostMessageService).toHaveBeenCalled();
    });

    it("execute test case7 - remove scheduled cache when flag set", async () =>
    {
        const { execute: playerRemoveCachePostMessageService } = await import("../service/PlayerRemoveCachePostMessageService");
        
        $player.stopFlag = false;
        $player.startTime = 0;
        $cacheStore.$removeCache = true;

        execute(20);

        expect($cacheStore.removeTimerScheduledCache).toHaveBeenCalled();
    });

    it("execute test case8 - request next frame", () =>
    {
        $player.stopFlag = false;

        execute(20);

        expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it("execute test case9 - update start time", () =>
    {
        $player.stopFlag = false;
        $player.startTime = 0;
        $player.fps = 16.666;

        execute(30);

        expect($player.startTime).toBeGreaterThan(0);
    });
});
