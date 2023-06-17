import { FocusEvent } from "../../../src/player/next2d/events/FocusEvent";

describe("FocusEvent.js static toString test", () =>
{

    it("static toString test", () =>
    {
        expect(FocusEvent.toString()).toBe("[class FocusEvent]");
    });

});

describe("FocusEvent.js toString test", () =>
{
    // toString
    it("toString test success", () =>
    {
        let event = new FocusEvent("focusIn");
        expect(event.toString()).toBe("[FocusEvent type=\"focusIn\" bubbles=true cancelable=false eventPhase=2]");
    });

});

describe("FocusEvent.js namespace test", () =>
{

    it("namespace test public", () =>
    {
        const object = new FocusEvent("test");
        expect(object.namespace).toBe("next2d.events.FocusEvent");
    });

    it("namespace test static", () =>
    {
        expect(FocusEvent.namespace).toBe("next2d.events.FocusEvent");
    });

});

describe("FocusEvent.js property test", () =>
{

    it("FOCUS_IN test", () =>
    {
        expect(FocusEvent.FOCUS_IN).toBe("focusIn");
    });

    it("FOCUS_OUT test", () =>
    {
        expect(FocusEvent.FOCUS_OUT).toBe("focusOut");
    });

});

