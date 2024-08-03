import { Event } from "./Event";
import { describe, expect, it } from "vitest";

describe("Event.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new Event("test").namespace).toBe("next2d.events.Event");
    });

    it("namespace test static", () =>
    {
        expect(Event.namespace).toBe("next2d.events.Event");
    });
});

describe("Event.js property test", () =>
{

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

    it("ENDED test", () =>
    {
        expect(Event.ENDED).toBe("ended");
    });

    it("ENTER_FRAME test", () =>
    {
        expect(Event.ENTER_FRAME).toBe("enterFrame");
    });

    it("FRAME_LABEL test", () =>
    {
        expect(Event.FRAME_LABEL).toBe("frameLabel");
    });

    it("OPEN test", () =>
    {
        expect(Event.OPEN).toBe("open");
    });

    it("REMOVED test", () =>
    {
        expect(Event.REMOVED).toBe("removed");
    });

    it("REMOVED_FROM_STAGE test", () =>
    {
        expect(Event.REMOVED_FROM_STAGE).toBe("removedFromStage");
    });

    it("RESIZE test", () =>
    {
        expect(Event.RESIZE).toBe("resize");
    });
});