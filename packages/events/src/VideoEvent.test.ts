import { VideoEvent } from "./VideoEvent";
import { describe, expect, it } from "vitest";

describe("VideoEvent.js toString test", () =>
{
    it("toString test success", () =>
    {
        const videoEvent = new VideoEvent("");
        expect(videoEvent.toString()).toBe("[VideoEvent type=\"\" bubbles=false cancelable=false eventPhase=2]");
    });
});

describe("VideoEvent.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(VideoEvent.toString()).toBe("[class VideoEvent]");
    });
});

describe("VideoEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const videoEvent = new VideoEvent("test");
        expect(videoEvent.namespace).toBe("next2d.events.VideoEvent");
    });

    it("namespace test static", () =>
    {
        expect(VideoEvent.namespace).toBe("next2d.events.VideoEvent");
    });
});

describe("VideoEvent.js property test", () =>
{
    it("PLAY_START test", () =>
    {
        expect(VideoEvent.PLAY_START).toBe("playStart");
    });

    it("PLAY test", () =>
    {
        expect(VideoEvent.PLAY).toBe("play");
    });

    it("PLAY_END test", () =>
    {
        expect(VideoEvent.PLAY_END).toBe("playEnd");
    });

    it("PAUSE test", () =>
    {
        expect(VideoEvent.PAUSE).toBe("pause");
    });

    it("SEEK test", () =>
    {
        expect(VideoEvent.SEEK).toBe("seek");
    });
});