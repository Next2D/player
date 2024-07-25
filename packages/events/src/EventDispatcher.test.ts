import { EventDispatcher } from "./EventDispatcher";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js toString test", function()
{
    // toString
    it("toString test success", () =>
    {
        const eventDispatcher = new EventDispatcher();
        expect(eventDispatcher.toString()).toBe("[object EventDispatcher]");
    });
});

describe("EventDispatcher.js static toString test", function()
{
    it("static toString test", function()
    {
        expect(EventDispatcher.toString()).toBe("[class EventDispatcher]");
    });
});

describe("EventDispatcher.js namespace test", function()
{
    it("namespace test public", function()
    {
        const eventDispatcher = new EventDispatcher();
        expect(eventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });

    it("namespace test static", function()
    {
        expect(EventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });
});