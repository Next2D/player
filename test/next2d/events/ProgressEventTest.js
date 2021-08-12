
describe("ProgressEvent.js toString test", function()
{
    it("toString test success", function()
    {
        let event = new ProgressEvent("");
        expect(event.toString()).toBe("[ProgressEvent type=\"\" bubbles=false cancelable=false eventPhase=2 bytesLoaded=0 bytesTotal=0]");
    });

});

describe("ProgressEvent.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(ProgressEvent.toString()).toBe("[class ProgressEvent]");
    });

});

describe("ProgressEvent.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new ProgressEvent("test");
        expect(object.namespace).toBe("next2d.events.ProgressEvent");
    });

    it("namespace test static", function()
    {
        expect(ProgressEvent.namespace).toBe("next2d.events.ProgressEvent");
    });

});

describe("ProgressEvent.js property test", function()
{

    it("PROGRESS test", function () {
        expect(ProgressEvent.PROGRESS).toBe("progress");
    });

    it("instance test", function ()
    {
        expect(new ProgressEvent() instanceof ProgressEvent).toBe(true);
    });

});