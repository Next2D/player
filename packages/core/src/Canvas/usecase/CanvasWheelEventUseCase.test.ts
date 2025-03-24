import type { DisplayObject } from "@next2d/display";
import { execute } from "./CanvasWheelEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $hitObject } from "../../CoreUtil";

describe("CanvasWheelEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const mockDisplayObject = {
            "isText": true,
            "scrollEnabled": true
        } as unknown as DisplayObject;

        let preventDefault = false;
        const mockEvent = {
            "preventDefault": vi.fn(() => preventDefault = true),
        } as unknown as WheelEvent;
        
        expect(preventDefault).toBe(false);

        $hitObject.hit = mockDisplayObject;
        execute(mockEvent);

        expect(preventDefault).toBe(true);
        $hitObject.hit = null;
    });
});