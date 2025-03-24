import { execute } from "./VideoSyncService";
import { describe, expect, it, vi } from "vitest";
import type { Video } from "@next2d/media";
import type { DisplayObjectContainer } from "@next2d/display";

describe("VideoSyncService.js test", () =>
{
    it("execute test case1", async () =>
    {
        let play = false;
        let pause = false;
        let seek = 100;
        const mockDisplayObject = {
            "isVideo": true,
            "muted": false,
            "loaded": true,
            "play": vi.fn(async () => play = true),
            "pause": vi.fn(() => pause = true),
            "seek": vi.fn((time)=> seek = time),
        } as unknown as Video;

        expect(play).toBe(false);
        expect(pause).toBe(false);
        expect(seek).toBe(100);

        await execute(mockDisplayObject);

        expect(play).toBe(true);
        expect(pause).toBe(true);
        expect(seek).toBe(0);
    });

    it("execute test case2", async () =>
    {
        let play = false;
        let pause = false;
        let seek = 100;
        const mockDisplayObject = {
            "isVideo": true,
            "muted": false,
            "loaded": true,
            "play": vi.fn(async () => play = true),
            "pause": vi.fn(() => pause = true),
            "seek": vi.fn((time)=> seek = time),
        } as unknown as Video;

        const mockDisplayObjectContainer = {
            "isContainerEnabled": true,
            "children": [mockDisplayObject],
        } as unknown as DisplayObjectContainer;

        expect(play).toBe(false);
        expect(pause).toBe(false);
        expect(seek).toBe(100);

        await execute(mockDisplayObjectContainer);

        expect(play).toBe(true);
        expect(pause).toBe(true);
        expect(seek).toBe(0);
    });
});