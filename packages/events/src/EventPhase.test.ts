import { EventPhase } from "./EventPhase";
import { describe, expect, it } from "vitest";

describe("EventPhase.js toString test", () =>
{
    it("toString test case1", () =>
    {
        const eventPhase = new EventPhase();
        expect(eventPhase.toString()).toBe("[object EventPhase]");
    });

});

describe("EventPhase.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(EventPhase.toString()).toBe("[class EventPhase]");
    });
});

describe("EventPhase.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const eventPhase = new EventPhase();
        expect(eventPhase.namespace).toBe("next2d.events.EventPhase");
    });

    it("namespace test static", () =>
    {
        expect(EventPhase.namespace).toBe("next2d.events.EventPhase");
    });
});

describe("EventPhase.js property test", () =>
{
    it("CAPTURING_PHASE test", () =>
    {
        expect(EventPhase.CAPTURING_PHASE).toBe(1);
    });

    it("AT_TARGET test", () =>
    {
        expect(EventPhase.AT_TARGET).toBe(2);
    });

    it("BUBBLING_PHASE test", () =>
    {
        expect(EventPhase.BUBBLING_PHASE).toBe(3);
    });
});