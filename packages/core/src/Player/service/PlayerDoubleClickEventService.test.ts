import { execute } from "./PlayerDoubleClickEventService";
import { $hitObject } from "../../CoreUtil";
import { DisplayObject, stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";
import { describe, expect, it } from "vitest";

describe("PlayerDoubleClickEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        const displayObject = new DisplayObject();
        
        let state = "none";
        displayObject.addEventListener(PointerEvent.DOUBLE_CLICK, () =>
        {
            state = "double_click";
        });

        $hitObject.hit = displayObject;

        expect(state).toBe("none");
        execute();
        expect(state).toBe("double_click");

        $hitObject.hit = null;
    });

    it("execute test case2", () =>
    {
        let state = "none";
        stage.addEventListener(PointerEvent.DOUBLE_CLICK, () =>
        {
            state = "double_click";
        });

        $hitObject.hit = null;

        expect($hitObject.hit).toBe(null);
        expect(state).toBe("none");
        execute();
        expect(state).toBe("double_click");
    }); 
});