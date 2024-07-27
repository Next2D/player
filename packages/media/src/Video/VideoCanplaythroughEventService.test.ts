import type { Video } from "../Video";
import { Event } from "@next2d/events";
import { execute } from "./VideoCanplaythroughEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundMixerUpdateVolumeService.js namespace test", () =>
{
    it("namespace test case1", async () =>
    {
        let playState = "stop";
        let eventState = "";
        let state = "";
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "autoPlay": true,
                "play": vi.fn(() => { playState = "play" }),
                "_$doChanged": vi.fn(() => { state = "changed" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn(() => { eventState = Event.COMPLETE })
            } as unknown as Video;
        });

        const MockHTMLVideoElement = vi.fn().mockImplementation(() =>
        {
            return {
                "play": vi.fn().mockResolvedValue(true),
                "pause": vi.fn(),
                "currentTime": 0
            } as unknown as HTMLVideoElement;
        });

        const mockVideo = new MockVideo();
        const mockElement = new MockHTMLVideoElement();

        // before
        expect(playState).toBe("stop");
        expect(eventState).toBe("");
        expect(state).toBe("");

        await execute(mockVideo, mockElement);

        // after
        expect(playState).toBe("play");
        expect(eventState).toBe(Event.COMPLETE);
        expect(state).toBe("changed");
    });

    it("namespace test case2", async () =>
    {
        let eventState = "";
        let state = "";
        const MockVideo = vi.fn().mockImplementation(() =>
        {
            return {
                "autoPlay": false,
                "_$doChanged": vi.fn(() => { state = "changed" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn(() => { eventState = Event.COMPLETE })
            } as unknown as Video;
        });

        let playState = "stop";
        let pauseState = "";
        const MockHTMLVideoElement = vi.fn().mockImplementation(() =>
        {
            return {
                "play": vi.fn(() => { playState = "play" }),
                "pause": vi.fn(() => { pauseState = "pause" }),
                "currentTime": 100
            } as unknown as HTMLVideoElement;
        });

        const mockVideo = new MockVideo();
        const mockElement = new MockHTMLVideoElement();

        // before
        expect(playState).toBe("stop");
        expect(eventState).toBe("");
        expect(pauseState).toBe("");
        expect(mockElement.currentTime).toBe(100);
        expect(state).toBe("");

        await execute(mockVideo, mockElement);

        // after
        expect(playState).toBe("play");
        expect(eventState).toBe(Event.COMPLETE);
        expect(pauseState).toBe("pause");
        expect(mockElement.currentTime).toBe(0);
        expect(state).toBe("changed");
    });
});