import { IOErrorEvent } from "./IOErrorEvent";
import { describe, expect, it } from "vitest";

describe("IOErrorEvent.js toString test", () =>
{
    // toString
    it("toString test case1", () =>
    {
        const ioErrorEvent = new IOErrorEvent("");
        expect(ioErrorEvent.toString()).toBe("[IOErrorEvent type=\"\" bubbles=false cancelable=false eventPhase=2 text=\"\"]");
    });

    it("toString test case2", () =>
    {
        const ioErrorEvent = new IOErrorEvent("ioError", false, false, "IOErrorEvent");
        expect(ioErrorEvent.toString()).toBe("[IOErrorEvent type=\"ioError\" bubbles=false cancelable=false eventPhase=2 text=\"IOErrorEvent\"]");
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
        const ioErrorEvent = new IOErrorEvent("test");
        expect(ioErrorEvent.namespace).toBe("next2d.events.IOErrorEvent");
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