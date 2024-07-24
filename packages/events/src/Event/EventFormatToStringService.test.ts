import { Event } from "../Event";
import { execute } from "./EventFormatToStringService";
import { describe, expect, it } from "vitest";

describe("EventFormatToStringService.js toString test", function()
{
    it("toString test case", function()
    {
        const event = new Event("test");
        expect(execute(event, "Event", "type", "bubbles", "cancelable", "eventPhase"))
            .toBe("[Event type=\"test\" bubbles=false cancelable=false eventPhase=2]");
    });
});
