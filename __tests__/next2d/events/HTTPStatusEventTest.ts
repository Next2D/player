import { HTTPStatusEvent } from "../../../src/next2d/events/HTTPStatusEvent";


describe("HTTPStatusEvent.js toString test", () =>
{
    it("toString test1 success", () =>
    {
        let event = new HTTPStatusEvent("");
        expect(event.toString()).toBe("[HTTPStatusEvent type=\"\" bubbles=false cancelable=false eventPhase=2 status=0 responseURL=\"\"]");
    });

    it("toString test2 success", () =>
    {
        let event = new HTTPStatusEvent("type", true, false, 200, "url");
        expect(event.toString()).toBe("[HTTPStatusEvent type=\"type\" bubbles=true cancelable=false eventPhase=2 status=200 responseURL=\"url\"]");
    });

});

describe("HTTPStatusEvent.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(HTTPStatusEvent.toString()).toBe("[class HTTPStatusEvent]");
    });

});

describe("HTTPStatusEvent.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new HTTPStatusEvent("test");
        expect(object.namespace).toBe("next2d.events.HTTPStatusEvent");
    });

    it("namespace test static", () =>
    {
        expect(HTTPStatusEvent.namespace).toBe("next2d.events.HTTPStatusEvent");
    });

});