import { execute } from "./PlayerPointerUpEventService";
import { PointerEvent } from "@next2d/events";
import { describe, expect, it, vi } from "vitest";
import { $hitObject } from "../../CoreUtil";

describe("PlayerPointerUpEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let pointerUp = false;
        const mockDisplayObject = {
            "willTrigger": () => true,
            "dispatchEvent": vi.fn((event) =>
            {
                switch (event.type) {

                    case PointerEvent.POINTER_UP:
                        pointerUp = true;
                        break;

                    default:
                        throw new Error("Invalid event type");

                }
            })
        };

        $hitObject.hit = mockDisplayObject;
        expect(pointerUp).toBe(false);

        execute();

        expect(pointerUp).toBe(true);
        $hitObject.hit = null;
    });
});