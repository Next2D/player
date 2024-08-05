import { Event } from "../../Event";
import { EventDispatcher } from "../../EventDispatcher";
import { $broadcastEvents } from "../../EventUtil";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js addEventListener test", () =>
{
    // addEventListener
    it("addEventListener test success case1", () =>
    {
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.addEventListener("test", () => { return "OK" });
        eventDispatcher.addEventListener("test", () => { return "NG" });

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test success case2", () =>
    {
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.addEventListener("test", () => { return "NG" }, false, 50);
        eventDispatcher.addEventListener("test", () => { return "OK" }, false, 100);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test success case3", () =>
    {
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.addEventListener("123", () => { return "NG" }, false, 50);
        eventDispatcher.addEventListener("123", () => { return "OK" }, false, 100);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("123");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        expect(events[0].listener()).toBe("OK");
        expect(events[1].listener()).toBe("NG");
    });

    it("addEventListener test duplicate case1", () =>
    {
        const eventDispatcher = new EventDispatcher();

        const a = () => { return "OK" };

        eventDispatcher.addEventListener("test", a);
        eventDispatcher.addEventListener("test", a);

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(1);
        expect(events[0].listener()).toBe("OK");
    });

    it("addEventListener test duplicate case2", () =>
    {
        const eventDispatcher = new EventDispatcher();

        let name = "";
        eventDispatcher.addEventListener("test", () => { name = "ok" });
        eventDispatcher.addEventListener("test", () => { name = "ng" });

        if (!eventDispatcher._$events) {
            throw new Error("addEventListener test success case1");
        }

        const events = eventDispatcher._$events.get("test");
        if (!events) {
            throw new Error("the events is none.");
        }

        expect(events.length).toBe(2);
        eventDispatcher.dispatchEvent(new Event("test"));
        expect(name).toBe("ng");
    });

    it("addEventListener test duplicate case3", () =>
    {
        const eventDispatcher1 = new EventDispatcher();
        const eventDispatcher2 = new EventDispatcher();

        let result = "";

        $broadcastEvents.clear();
        expect($broadcastEvents.size).toBe(0);
        eventDispatcher1.addEventListener(Event.ENTER_FRAME, () => { result += "A" });
        eventDispatcher2.addEventListener(Event.ENTER_FRAME, () => { result += "B" });

        expect($broadcastEvents.size).toBe(1);
        expect($broadcastEvents.get(Event.ENTER_FRAME)?.length).toBe(2);

        eventDispatcher1.dispatchEvent(new Event(Event.ENTER_FRAME));
        expect(result).toBe("AB");

        result = "";
        expect(result).toBe("");
        eventDispatcher2.dispatchEvent(new Event(Event.ENTER_FRAME));
        expect(result).toBe("AB");
    });
});