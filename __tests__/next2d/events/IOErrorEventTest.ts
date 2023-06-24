import { IOErrorEvent } from "../../../src/next2d/events/IOErrorEvent";

describe("IOErrorEvent.js toString test", () =>
{
    // toString
    it("toString test1 success", () =>
    {
        let event = new IOErrorEvent("");
        expect(event.toString()).toBe("[IOErrorEvent type=\"\" bubbles=false cancelable=false eventPhase=2 text=\"\"]");
    });

    it("toString test2 success", () =>
    {
        let event = new IOErrorEvent("ioError", false, false, "IOErrorEvent");
        expect(event.toString()).toBe("[IOErrorEvent type=\"ioError\" bubbles=false cancelable=false eventPhase=2 text=\"IOErrorEvent\"]");
    });

});

describe("IOErrorEvent.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(IOErrorEvent.toString()).toBe("[class IOErrorEvent]");
    });

});

describe("IOErrorEvent.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new IOErrorEvent("test");
        expect(object.namespace).toBe("next2d.events.IOErrorEvent");
    });

    it("namespace test static", () =>
    {
        expect(IOErrorEvent.namespace).toBe("next2d.events.IOErrorEvent");
    });

});

describe("IOErrorEvent.js property test", () =>
{

    it("IO_ERROR test", function () {
        expect(IOErrorEvent.IO_ERROR).toBe("ioError");
    });

});