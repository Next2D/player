import type { Video } from "../Video";
import { VideoEvent } from "@next2d/events";
import { execute } from "./VideoPlayEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoPlayEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let pauseState = "";
        let eventState = "";
        let state = "";
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "stage": true,
                "pause": vi.fn(() => { pauseState = "pause" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn((event: VideoEvent) => { eventState = event.type }),
                "_$doChanged": vi.fn(() => { state = "doChanged" })
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();
        expect(pauseState).toBe("");
        expect(eventState).toBe("");
        expect(state).toBe("");

        cancelAnimationFrame(execute(mockVideo));

        expect(state).toBe("doChanged");
        expect(pauseState).toBe("");
        expect(eventState).toBe(VideoEvent.PLAY);

        mockVideo.stage = false;
        cancelAnimationFrame(execute(mockVideo));
        expect(pauseState).toBe("pause");
    });
});