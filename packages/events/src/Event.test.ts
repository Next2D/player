import { Event } from "./Event";
import { describe, expect, it } from "vitest";

describe("Event.js toString test", function()
{
    it("toString test case1", function()
    {
        const event = new Event("test");
        expect(event.toString())
            .toBe("[Event type=\"test\" bubbles=false cancelable=false eventPhase=2]");
    });
});

describe("Event.js static toString test", function()
{
    it("static toString test", function()
    {
        expect(Event.toString()).toBe("[class Event]");
    });
});

describe("Event.js namespace test", function()
{
    it("namespace test public", function()
    {
        const event = new Event("test");
        expect(event.namespace).toBe("next2d.events.Event");
    });

    it("namespace test static", function()
    {
        expect(Event.namespace).toBe("next2d.events.Event");
    });
});

describe("Event.js property test", function()
{

    it("ACTIVATE test", () =>
    {
        expect(Event.ACTIVATE).toBe("activate");
    });

    it("ADDED test", () =>
    {
        expect(Event.ADDED).toBe("added");
    });

    it("ADDED_TO_STAGE test", () =>
    {
        expect(Event.ADDED_TO_STAGE).toBe("addedToStage");
    });

    it("CHANGE test", () =>
    {
        expect(Event.CHANGE).toBe("change");
    });

    it("COMPLETE test", () =>
    {
        expect(Event.COMPLETE).toBe("complete");
    });

    it("DEACTIVATE test", () =>
    {
        expect(Event.DEACTIVATE).toBe("deactivate");
    });

    it("ENTER_FRAME test", () =>
    {
        expect(Event.ENTER_FRAME).toBe("enterFrame");
    });

    it("EXIT_FRAME test", () =>
    {
        expect(Event.EXIT_FRAME).toBe("exitFrame");
    });

    it("FRAME_CONSTRUCTED test", () =>
    {
        expect(Event.FRAME_CONSTRUCTED).toBe("frameConstructed");
    });

    it("FRAME_LABEL test", () =>
    {
        expect(Event.FRAME_LABEL).toBe("frameLabel");
    });

    it("INIT test", () =>
    {
        expect(Event.INIT).toBe("init");
    });

    it("LOAD test", () =>
    {
        expect(Event.LOAD).toBe("load");
    });

    it("MOUSE_LEAVE test", () =>
    {
        expect(Event.MOUSE_LEAVE).toBe("mouseLeave");
    });

    it("REMOVED test", () =>
    {
        expect(Event.REMOVED).toBe("removed");
    });

    it("REMOVED_FROM_STAGE test", () =>
    {
        expect(Event.REMOVED_FROM_STAGE).toBe("removedFromStage");
    });

    it("RENDER test", () =>
    {
        expect(Event.RENDER).toBe("render");
    });

    it("RESIZE test", () =>
    {
        expect(Event.RESIZE).toBe("resize");
    });

    it("SCROLL test", () =>
    {
        expect(Event.SCROLL).toBe("scroll");
    });

    it("OPEN test", () =>
    {
        expect(Event.OPEN).toBe("open");
    });

    it("STOP test", () =>
    {
        expect(Event.STOP).toBe("stop");
    });

    it("SOUND_COMPLETE test", () =>
    {
        expect(Event.SOUND_COMPLETE).toBe("soundComplete");
    });

    it("UPDATE test", () =>
    {
        expect(Event.UPDATE).toBe("update");
    });
});