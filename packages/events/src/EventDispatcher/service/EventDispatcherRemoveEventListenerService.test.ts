import { Event } from "../../Event";
import { $broadcastEvents } from "../../EventUtil";
import { EventDispatcher } from "../../EventDispatcher";
import { IEventListener } from "../../interface/IEventListener";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js removeEventListener test", () =>
{
    it("removeEventListener test case1", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const test1 = () => { return "OK1" };
        const test2 = () => { return "OK2" };
        const test3 = () => { return "OK3" };

        eventDispatcher.addEventListener("test", test1, false, 10);
        eventDispatcher.addEventListener("test", test2, false, 20);
        eventDispatcher.addEventListener("test", test3, false, 30);

        eventDispatcher.removeEventListener("test", test2);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK3");
        expect(events[1].listener()).toBe("OK1");
    });

    it("removeEventListener test case2", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const a = () => { return "ok" };
        const b = () => { return "no" };

        eventDispatcher.addEventListener("test", a);
        eventDispatcher.addEventListener("test", b);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        eventDispatcher.removeEventListener("test", a);

        expect(eventDispatcher._$events.has("test")).toBe(true);
        expect(events.length).toBe(1);
    });

    it("removeEventListener test case3", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const a = () => { return "yes" };
        const b = () => { return "no" };

        eventDispatcher.addEventListener("test", a, true);
        eventDispatcher.addEventListener("test", b, false);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        eventDispatcher.removeEventListener("test", b, true);
        eventDispatcher.removeEventListener("test", a, true);

        expect(events.length).toBe(1);
        expect(events[0].listener().toString()).toBe("no");
    });

    it("removeEventListener test case4", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const a = () => { return "ok" };
        const b = () => { return "no" };

        eventDispatcher.addEventListener("test", a, true);
        eventDispatcher.addEventListener("test", b, false);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);

        eventDispatcher.removeEventListener("test", a, false);
        eventDispatcher.removeEventListener("test", b, true);

        expect(events.length).toBe(2);
        expect(events[0].listener().toString()).toBe("ok");
        expect(events[1].listener().toString()).toBe("no");
    });

    it("removeEventListener test case5", () =>
    {
        const eventDispatcher1 = new EventDispatcher();
        const eventDispatcher2 = new EventDispatcher();

        const a = () => { return undefined };

        $broadcastEvents.clear();
        expect($broadcastEvents.size).toBe(0);
        expect($broadcastEvents.has(Event.ENTER_FRAME)).toBe(false);

        eventDispatcher1.addEventListener(Event.ENTER_FRAME, a);
        eventDispatcher2.addEventListener(Event.ENTER_FRAME, a);

        expect($broadcastEvents.size).toBe(1);
        expect($broadcastEvents.has(Event.ENTER_FRAME)).toBe(true);

        const events = $broadcastEvents.get(Event.ENTER_FRAME) as NonNullable<IEventListener[]>;
        expect(events.length).toBe(2);

        eventDispatcher1.removeEventListener(Event.ENTER_FRAME, a);
        expect(events.length).toBe(1);
        expect($broadcastEvents.has(Event.ENTER_FRAME)).toBe(true);

        eventDispatcher2.removeEventListener(Event.ENTER_FRAME, a);
        expect(events.length).toBe(0);
        expect($broadcastEvents.has(Event.ENTER_FRAME)).toBe(false);
    });

});