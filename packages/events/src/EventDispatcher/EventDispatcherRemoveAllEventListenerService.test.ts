import { Event } from "../Event";
import { EventDispatcher } from "../EventDispatcher";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js removeAllEventListener test", function()
{
    it("removeAllEventListener test case1", () =>
    {
        const eventDispatcher = new EventDispatcher();
        eventDispatcher.addEventListener("test", () => {});
        eventDispatcher.addEventListener("test", () => {});
        eventDispatcher.addEventListener("test", () => {});

        expect(eventDispatcher.hasEventListener("test")).toBe(true);
        eventDispatcher.removeAllEventListener("test");
        expect(eventDispatcher.hasEventListener("test")).toBe(false);
    });

    it("removeAllEventListener test case2", () =>
    {
        const eventDispatcher = new EventDispatcher();
        eventDispatcher.addEventListener(Event.ENTER_FRAME, () => {});

        expect(eventDispatcher.hasEventListener(Event.ENTER_FRAME)).toBe(true);
        eventDispatcher.removeAllEventListener(Event.ENTER_FRAME);
        expect(eventDispatcher.hasEventListener(Event.ENTER_FRAME)).toBe(false);
    });
});
