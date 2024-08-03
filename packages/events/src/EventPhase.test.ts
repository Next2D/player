import { EventPhase } from "./EventPhase";
import { describe, expect, it } from "vitest";

describe("EventPhase.js namespace test", () =>
{
    it("namespace test public", () =>
    {
        expect(new EventPhase().namespace).toBe("next2d.events.EventPhase");
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