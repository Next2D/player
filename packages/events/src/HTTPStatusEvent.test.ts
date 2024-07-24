import { HTTPStatusEvent } from "./HTTPStatusEvent";
import { describe, expect, it } from "vitest";

describe("HTTPStatusEvent.js toString test", () =>
{
    it("toString test case1", () =>
    {
        const httpStatusEvent = new HTTPStatusEvent("");
        expect(httpStatusEvent.toString()).toBe("[HTTPStatusEvent type=\"\" bubbles=false cancelable=false eventPhase=2 status=0 responseURL=\"\"]");
    });

    it("toString test case2", () =>
    {
        const httpStatusEvent = new HTTPStatusEvent("type", true, false, 200, "url");
        expect(httpStatusEvent.toString()).toBe("[HTTPStatusEvent type=\"type\" bubbles=true cancelable=false eventPhase=2 status=200 responseURL=\"url\"]");
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