import { execute } from "./CanvasPointerDownEventUseCase";
import { describe, expect, it, vi } from "vitest";
import { $hitObject } from "../../CoreUtil";
import { DisplayObject } from "@next2d/display";

describe("CanvasPointerDownEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        const canvas = document.createElement("canvas");

        let pointerId = 0;
        canvas.setPointerCapture = vi.fn((pointer_id) => pointerId = pointer_id);

        let preventDefault = false;
        const mockEvent = {
            "target": canvas,
            "pointerId": 1,
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;
        
        expect(preventDefault).toBe(false);
        expect(pointerId).toBe(0);

        $hitObject.hit = new DisplayObject();
        execute(mockEvent);
        
        expect(preventDefault).toBe(true);
        expect(pointerId).toBe(1);
        $hitObject.hit = null;
    });
});