import { ProgressEvent } from "../../../src/next2d/events/ProgressEvent";

describe("ProgressEvent.js toString test", () =>
{
    it("toString test success", () =>
    {
        let event = new ProgressEvent("");
        expect(event.toString()).toBe("[ProgressEvent type=\"\" bubbles=false cancelable=false eventPhase=2 bytesLoaded=0 bytesTotal=0]");
    });

});

describe("ProgressEvent.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(ProgressEvent.toString()).toBe("[class ProgressEvent]");
    });

});

describe("ProgressEvent.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new ProgressEvent("test");
        expect(object.namespace).toBe("next2d.events.ProgressEvent");
    });

    it("namespace test static", () =>
    {
        expect(ProgressEvent.namespace).toBe("next2d.events.ProgressEvent");
    });

});

describe("ProgressEvent.js property test", () =>
{

    it("PROGRESS test", () => {
        expect(ProgressEvent.PROGRESS).toBe("progress");
    });

});