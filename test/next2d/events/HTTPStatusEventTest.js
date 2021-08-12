
describe("HTTPStatusEvent.js toString test", function()
{
    it("toString test1 success", function()
    {
        let event = new HTTPStatusEvent("");
        expect(event.toString()).toBe("[HTTPStatusEvent type=\"\" bubbles=false cancelable=false eventPhase=2 status=0 responseURL=\"\"]");
    });

    it("toString test2 success", function()
    {
        let event = new HTTPStatusEvent("type", true, false, 200);
        event._$responseURL = "url";
        expect(event.toString()).toBe("[HTTPStatusEvent type=\"type\" bubbles=true cancelable=false eventPhase=2 status=200 responseURL=\"url\"]");
    });

});

describe("HTTPStatusEvent.js static toString test", function()
{

    it("static toString test", function()
    {
        expect(HTTPStatusEvent.toString()).toBe("[class HTTPStatusEvent]");
    });

});

describe("HTTPStatusEvent.js namespace test", function()
{

    it("namespace test public", function()
    {
        const object = new HTTPStatusEvent("test");
        expect(object.namespace).toBe("next2d.events.HTTPStatusEvent");
    });

    it("namespace test static", function()
    {
        expect(HTTPStatusEvent.namespace).toBe("next2d.events.HTTPStatusEvent");
    });

});