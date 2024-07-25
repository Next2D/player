import { Event } from "../Event";
import { EventDispatcher } from "../EventDispatcher";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js hasEventListener test", () =>
{
    it("hasEventListener test case1", () =>
    {
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.addEventListener("test1", () => { return "OK" });
        eventDispatcher.addEventListener("test3", () => { return "NG" });

        expect(eventDispatcher.hasEventListener("test1")).toBe(true);
        expect(eventDispatcher.hasEventListener("test2")).toBe(false);
        expect(eventDispatcher.hasEventListener("test3")).toBe(true);
        expect(eventDispatcher.hasEventListener("test4")).toBe(false);

    });

    // メソッドが所属する EventDispatcher インスタンスについてのみリスナーが登録されているか
    it("hasEventListener test case2", () =>
    {
        const eventDispatcher1 = new EventDispatcher();
        const eventDispatcher2 = new EventDispatcher();
        const eventDispatcher3 = new EventDispatcher();

        eventDispatcher2.addEventListener(Event.ENTER_FRAME, () => { return "OK" });

        expect(eventDispatcher1.hasEventListener(Event.ENTER_FRAME)).toBe(false);
        expect(eventDispatcher2.hasEventListener(Event.ENTER_FRAME)).toBe(true);
        expect(eventDispatcher3.hasEventListener(Event.ENTER_FRAME)).toBe(false);

    });
});