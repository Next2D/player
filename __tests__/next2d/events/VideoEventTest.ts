import { VideoEvent } from "../../../packages/events/src/VideoEvent";

describe("VideoEvent.js toString test", () =>
{
    it("toString test success", () =>
    {
        let event = new VideoEvent("");
        expect(event.toString()).toBe("[VideoEvent type=\"\" bubbles=false cancelable=false eventPhase=2 bytesLoaded=0 bytesTotal=0]");
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
        const object = new VideoEvent("test");
        expect(object.namespace).toBe("next2d.events.VideoEvent");
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

    it("PROGRESS test", () =>
    {
        expect(VideoEvent.PROGRESS).toBe("progress");
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