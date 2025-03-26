import { execute } from "./CanvasPointerMoveEventUseCase";
import { describe, expect, it, vi } from "vitest";
import type { DisplayObject } from "@next2d/display";
import { PointerEvent as Next2D_PointerEvent } from "@next2d/events";
import { $hitObject } from "../../CoreUtil";

describe("CanvasPointerMoveEventUseCase.js test", () =>
{
    it("execute test case1", () =>
    {
        let pointerMove = false;
        let pointerOver = false;

        const mockDisplayObject = {
            "willTrigger": vi.fn(() => true),
            "dispatchEvent": vi.fn((event) =>
            {
                switch (event.type) {

                    case Next2D_PointerEvent.POINTER_MOVE:
                        pointerMove = true;
                        break;

                    case Next2D_PointerEvent.POINTER_OVER:
                        pointerOver = true;
                        break;

                    default:
                        throw new Error("Unknown event type.");

                }
            })
        } as unknown as DisplayObject;

        const canvas = document.createElement("canvas");

        let preventDefault = false;
        const mockEvent = {
            "target": canvas,
            "preventDefault": vi.fn(() => preventDefault = true)
        } as unknown as PointerEvent;
        
        expect(preventDefault).toBe(false);
        expect(pointerMove).toBe(false);
        expect(pointerOver).toBe(false);

        $hitObject.hit = mockDisplayObject;
        execute(mockEvent);
        
        expect(preventDefault).toBe(true);
        expect(pointerMove).toBe(true);
        expect(pointerOver).toBe(true);
        $hitObject.hit = null;
    });
});