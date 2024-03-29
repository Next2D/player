import { Event } from "../../../packages/events/src/Event";

describe("Event.js toString test", function()
{
    it("toString test success", function()
    {
        const object = new Event("test");
        expect(object.toString())
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
        const object = new Event("test");
        expect(object.namespace).toBe("next2d.events.Event");
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

    it("INIT test", () =>
    {
        expect(Event.INIT).toBe("init");
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

    it("SOUND_COMPLETE test", () =>
    {
        expect(Event.SOUND_COMPLETE).toBe("soundComplete");
    });

    it("FRAME_CONSTRUCTED test", () =>
    {
        expect(Event.FRAME_CONSTRUCTED).toBe("frameConstructed");
    });

    it("FRAME_LABEL test", () =>
    {
        expect(Event.FRAME_LABEL).toBe("frameLabel");
    });
});