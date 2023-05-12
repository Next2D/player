
describe("VideoEvent.js toString test", function()
{
    it("toString test success", function()
    {
        let event = new VideoEvent("");
        expect(event.toString()).toBe("[VideoEvent type=\"\" bubbles=false cancelable=false eventPhase=2 bytesLoaded=0 bytesTotal=0]");
    });

});

describe("VideoEvent.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(VideoEvent.toString()).toBe("[class VideoEvent]");
    });

});

describe("VideoEvent.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new VideoEvent("test");
        expect(object.namespace).toBe("next2d.events.VideoEvent");
    });

    it("namespace test static", function()
    {
        expect(VideoEvent.namespace).toBe("next2d.events.VideoEvent");
    });

});

describe("VideoEvent.js property test", function()
{

    it("PLAY_START test", function () {
        expect(VideoEvent.PLAY_START).toBe("playStart");
    });

    it("PLAY test", function () {
        expect(VideoEvent.PLAY).toBe("play");
    });

    it("PROGRESS test", function () {
        expect(VideoEvent.PROGRESS).toBe("progress");
    });

    it("PLAY_END test", function () {
        expect(VideoEvent.PLAY_END).toBe("playEnd");
    });

    it("PAUSE test", function () {
        expect(VideoEvent.PAUSE).toBe("pause");
    });

    it("SEEK test", function () {
        expect(VideoEvent.SEEK).toBe("seek");
    });

    it("instance test", function ()
    {
        expect(new VideoEvent() instanceof VideoEvent).toBe(true);
    });

});