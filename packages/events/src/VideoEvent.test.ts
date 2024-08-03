import { VideoEvent } from "./VideoEvent";
import { describe, expect, it } from "vitest";

describe("VideoEvent.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new VideoEvent("test").namespace).toBe("next2d.events.VideoEvent");
    });

    it("namespace test static", () =>
    {
        expect(VideoEvent.namespace).toBe("next2d.events.VideoEvent");
    });
});

describe("VideoEvent.js property test", () =>
{
    it("PLAY test", () =>
    {
        expect(VideoEvent.PLAY).toBe("play");
    });

    it("PLAYING test", () =>
    {
        expect(VideoEvent.PLAYING).toBe("playing");
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