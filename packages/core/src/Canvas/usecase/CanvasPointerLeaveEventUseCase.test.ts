import { execute } from "./CanvasPointerLeaveEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $setRollOverDisplayObject } from "../../CoreUtil";
import type { DisplayObject } from "@next2d/display";
import { PointerEvent as Next2D_PointerEvent } from "@next2d/events";

describe("CanvasPointerLeaveEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const mockDisplayObject = {
            "willTrigger": vi.fn(() => true),
            "dispatchEvent": vi.fn((event) =>
            {
                expect(event.type).toBe(Next2D_PointerEvent.POINTER_LEAVE);
            })
        } as unknown as DisplayObject;

        let preventDefault = false;
        const mockEvent = {
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;
        
        expect(preventDefault).toBe(false);

        $setRollOverDisplayObject(mockDisplayObject);
        execute(mockEvent);
        
        expect(preventDefault).toBe(true);
        $setRollOverDisplayObject(null);
    });
});