import { Sound } from "../../Sound";
import { Event } from "@next2d/events";
import { execute } from "./SoundEndedEventService";
import { describe, expect, it, vi } from "vitest";

describe("SoundEndedEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let state = "";
        const MockSound = vi.fn(function(this: any) {
            this.canLoop = true;
            this.play = vi.fn(() => { state = "play" });
            this.stop = vi.fn();
            this.hasEventListener = vi.fn();
            this.dispatchEvent = vi.fn();
        }) as any;

        expect(state).toBe("");
        execute(new MockSound());
        expect(state).toBe("play");
    });

    it("execute test case2", () =>
    {
        let state = "";
        let type = "";
        const MockSound = vi.fn(function(this: any) {
            this.canLoop = false;
            this.play = vi.fn();
            this.stop = vi.fn(() => { state = "stop" });
            this.willTrigger = vi.fn(() => true);
            this.dispatchEvent = vi.fn((event: Event) => { type = event.type });
        }) as any;

        expect(type).toBe("");
        expect(state).toBe("");
        execute(new MockSound());
        expect(state).toBe("stop");
        expect(type).toBe(Event.COMPLETE);
    });
});