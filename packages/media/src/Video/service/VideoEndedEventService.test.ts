import type { Video } from "../../Video";
import { VideoEvent } from "@next2d/events";
import { execute } from "./VideoEndedEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoEndedEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let eventType = "";
        let pauseState = "";
        const MockVideo = vi.fn(function(this: any) {
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn((event: VideoEvent) => { eventType = event.type });
            this.loop = true;
            this.pause = vi.fn(() => { pauseState = "pause" });
            this.currentTime = 100;
        }) as any;

        expect(eventType).toBe("");
        expect(pauseState).toBe("");

        const mockVideo = new MockVideo();
        expect(mockVideo.currentTime).toBe(100);

        execute(mockVideo);

        expect(eventType).toBe(VideoEvent.ENDED);
        expect(pauseState).toBe("");
        expect(mockVideo.currentTime).toBe(0);
    });

    it("execute test case2", () =>
    {
        let eventType = "";
        let pauseState = "";
        const MockVideo = vi.fn(function(this: any) {
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn((event: VideoEvent) => { eventType = event.type });
            this.loop = false;
            this.pause = vi.fn(() => { pauseState = "pause" });
            this.currentTime = 100;
        }) as any;

        expect(eventType).toBe("");
        expect(pauseState).toBe("");

        const mockVideo = new MockVideo();
        expect(mockVideo.currentTime).toBe(100);

        execute(mockVideo);

        expect(eventType).toBe(VideoEvent.ENDED);
        expect(pauseState).toBe("pause");
        expect(mockVideo.currentTime).toBe(100);
    });
});