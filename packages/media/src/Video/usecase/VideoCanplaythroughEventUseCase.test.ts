import type { Video } from "../../Video";
import { Event } from "@next2d/events";
import { execute } from "./VideoCanplaythroughEventUseCase";
import { describe, expect, it, vi } from "vitest";

describe("VideoCanplaythroughEventService.js test", () =>
{
    it("execute test case1", async () =>
    {
        let playState = "stop";
        let eventState = "";
        const MockVideo = vi.fn(function(this: any) {
            this.autoPlay = true;
            this.play = vi.fn(() => { playState = "play" });
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn(() => { eventState = Event.COMPLETE });
        }) as any;

        const mockVideo = new MockVideo();

        // before
        expect(playState).toBe("stop");
        expect(eventState).toBe("");

        mockVideo.changed = false;
        expect(mockVideo.changed).toBe(false);

        await execute(mockVideo);

        // after
        expect(playState).toBe("play");
        expect(eventState).toBe(Event.COMPLETE);
        expect(mockVideo.changed).toBe(true);
    });

    it("execute test case2", async () =>
    {
        let eventState = "";
        const MockVideo = vi.fn(function(this: any) {
            this.autoPlay = false;
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn(() => { eventState = Event.COMPLETE });
        }) as any;

        const mockVideo = new MockVideo();

        // before
        mockVideo.changed = false;
        expect(eventState).toBe("");
        expect(mockVideo.changed).toBe(false);

        await execute(mockVideo);

        // after
        expect(eventState).toBe(Event.COMPLETE);
        expect(mockVideo.changed).toBe(true);
    });
});