import { EventDispatcher } from "./EventDispatcher";
import { describe, expect, it } from "vitest";

describe("EventDispatcher.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new EventDispatcher().namespace).toBe("next2d.events.EventDispatcher");
    });

    it("namespace test static", () =>
    {
        expect(EventDispatcher.namespace).toBe("next2d.events.EventDispatcher");
    });
});