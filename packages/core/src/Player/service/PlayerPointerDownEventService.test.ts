import { execute } from "./PlayerPointerDownEventService";
import { $hitObject } from "../../CoreUtil";
import { PointerEvent } from "@next2d/events";
import { TextField } from "@next2d/text";
import { DisplayObject, stage } from "@next2d/display";
import { describe, expect, it } from "vitest";

describe("PlayerPointerDownEventService.js test", () =>
{
    it("execute test case1", () =>
    {
        let state = "none";
        stage.addEventListener(PointerEvent.POINTER_DOWN, () =>
        {
            state = "pointerdown";
        });

        $hitObject.hit = null;

        expect($hitObject.hit).toBe(null);
        expect(state).toBe("none");
        execute();
        expect(state).toBe("pointerdown");
    });

    it("execute test case2", () =>
    {
        const displayObject = new DisplayObject();
        
        let state = "none";
        displayObject.addEventListener(PointerEvent.POINTER_DOWN, () =>
        {
            state = "pointerdown";
        });

        $hitObject.hit = displayObject;

        expect(state).toBe("none");
        execute();
        expect(state).toBe("pointerdown");

        $hitObject.hit = null;
    });

    it("execute test case3", () =>
    {
        const textField = new TextField();
        textField.type = "input";

        $hitObject.hit = textField;

        expect(textField.focus).toBe(false);
        execute();
        expect(textField.focus).toBe(true);
        execute();
        expect(textField.focus).toBe(true);

        $hitObject.hit = null;
        execute();
        expect(textField.focus).toBe(false);

        $hitObject.hit = textField;
        execute();
        expect(textField.focus).toBe(true);

        $hitObject.hit = new DisplayObject();
        execute();
        expect(textField.focus).toBe(false);

        $hitObject.hit = null;
        execute();
        expect(textField.focus).toBe(false);
    });
});