import { EventDispatcher } from "./EventDispatcher";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js toString test", () =>
{
    // toString
    it("toString test success", () =>
    {
        const eventDispatcher = new EventDispatcher();
        expect(eventDispatcher.toString()).toBe("[object EventDispatcher]");
    });
});

describe("EventDispatcher.js static toString test", () =>
{
    it("static toString test", () =>
    {
        expect(EventDispatcher.toString()).toBe("[class EventDispatcher]");
    });
});

describe("EventDispatcher.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        const eventDispatcher = new EventDispatcher();
        expect(eventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });

    it("namespace test static", () =>
    {
        expect(EventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });
});