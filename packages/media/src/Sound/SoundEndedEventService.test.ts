import { Sound } from "../Sound";
import { Event } from "@next2d/events";
import { execute } from "./SoundEndedEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundEndedEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let state = "";
        const MockSound = vi.fn().mockImplementation(() =>
        {
            return {
                "canLoop": true,
                "play": vi.fn(() => { state = "play" }),
                "stop": vi.fn(),
                "hasEventListener": vi.fn(),
                "dispatchEvent": vi.fn()
            } as unknown as Sound;
        });

        expect(state).toBe("");
        execute(new MockSound());
        expect(state).toBe("play");
    });

    it("execute test case2", () =>
    {
        let state = "";
        let type = "";
        const MockSound = vi.fn().mockImplementation(() =>
        {
            return {
                "canLoop": false,
                "play": vi.fn(),
                "stop": vi.fn(() => { state = "stop" }),
                "willTrigger": vi.fn(() => true),
                "dispatchEvent": vi.fn((event: Event) => { type = event.type })
            } as unknown as Sound;
        });

        expect(type).toBe("");
        expect(state).toBe("");
        execute(new MockSound());
        expect(state).toBe("stop");
        expect(type).toBe(Event.COMPLETE);
    });
});