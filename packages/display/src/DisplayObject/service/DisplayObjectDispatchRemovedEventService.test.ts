import { execute } from "./DisplayObjectDispatchRemovedEventService";
import { DisplayObject } from "../../DisplayObject";
import { describe, expect, it, vi } from "vitest";
import { Event } from "@next2d/events";

describe("DisplayObjectDispatchRemovedEventService.js test", () =>
{
    it("execute test case", () =>
    {
        const displayObject = new DisplayObject();
        displayObject.willTrigger = vi.fn(() => true);
        let type = "";
        displayObject.dispatchEvent = vi.fn((event): boolean =>
        {
            type = event.type;
            return true;
        });

        displayObject.$added = true;
        expect(type).toBe("");
        expect(displayObject.$added).toBe(true);
        execute(displayObject);
        expect(displayObject.$added).toBe(false);
        expect(type).toBe(Event.REMOVED);
    });
});