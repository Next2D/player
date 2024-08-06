import type { Video } from "../../Video";
import { Event } from "@next2d/events";
import { execute } from "./VideoCanplaythroughEventService";
import { describe, expect, it, vi } from "vitest";

describe("VideoCanplaythroughEventService.js test", () =>
{
    it("execute test case1", async () =>
    {
        let playState = "stop";
        let eventState = "";
        let state = "";
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "autoPlay": true,
                "play": vi.fn(() => { playState = "play" }),
                "_$changed": vi.fn(() => { state = "changed" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn(() => { eventState = Event.COMPLETE })
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();

        // before
        expect(playState).toBe("stop");
        expect(eventState).toBe("");
        expect(state).toBe("");

        await execute(mockVideo);

        // after
        expect(playState).toBe("play");
        expect(eventState).toBe(Event.COMPLETE);
        expect(state).toBe("changed");
    });

    it("execute test case2", async () =>
    {
        let eventState = "";
        let state = "";
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "autoPlay": false,
                "_$changed": vi.fn(() => { state = "changed" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn(() => { eventState = Event.COMPLETE })
            } as unknown as Video;
        });

        const mockVideo = new MockVideo();

        // before
        expect(eventState).toBe("");
        expect(state).toBe("");

        await execute(mockVideo);

        // after
        expect(eventState).toBe(Event.COMPLETE);
        expect(state).toBe("changed");
    });
});