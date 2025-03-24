import { execute } from "./PlayerPointerMoveEventService";
import { PointerEvent } from "@next2d/events";
import { describe, expect, it, vi } from "vitest";
import { 
    $hitObject,
    $setRollOverDisplayObject,
    $getRollOverDisplayObject
} from "../../CoreUtil";

describe("PlayerPointerMoveEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let pointerMove = false;
        let pointerOver = false;
        const mockDisplayObject = {
            "willTrigger": () => true,
            "dispatchEvent": vi.fn((event) =>
            {
                switch (event.type) {

                    case PointerEvent.POINTER_MOVE:
                        pointerMove = true;
                        break;

                    case PointerEvent.POINTER_OVER:
                        pointerOver = true;
                        break;

                    default:
                        throw new Error("Invalid event type");

                }
            })
        };

        $hitObject.hit = mockDisplayObject;

        expect(pointerMove).toBe(false);
        expect(pointerOver).toBe(false);
        
        $setRollOverDisplayObject(null);
        expect($getRollOverDisplayObject()).toBeNull();

        execute();

        expect(pointerMove).toBe(true);
        expect(pointerOver).toBe(true);

        expect($getRollOverDisplayObject()).not.toBeNull();
        $setRollOverDisplayObject(null);

        $hitObject.hit = null;
    });
});