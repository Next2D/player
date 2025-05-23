import type { Video } from "../../Video";
import { $getPlayingVideos } from "../../MediaUtil";
import { VideoEvent } from "@next2d/events";
import { execute } from "./VideoPlayEventUseCase";
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
                "pause": vi.fn(() => { pauseState = "pause" }),
                "loaded": true,
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn((event: VideoEvent) => { eventState = event.type }),
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();
        expect(pauseState).toBe("");
        expect(eventState).toBe("");

        mockVideo.changed = false;
        expect(mockVideo.changed).toBe(false);

        const playingVideos = $getPlayingVideos();
        playingVideos.length = 0;
        expect(playingVideos.length).toBe(0);

        cancelAnimationFrame(execute(mockVideo));

        expect(playingVideos.length).toBe(1);
        expect(mockVideo.changed).toBe(true);
        expect(pauseState).toBe("");
        expect(eventState).toBe(VideoEvent.PLAY);
    });
});