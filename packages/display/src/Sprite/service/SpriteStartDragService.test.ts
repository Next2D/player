import { execute } from "./SpriteStartDragService";
import { Sprite } from "../../Sprite";
import { describe, expect, it } from "vitest";
import {
    $pointer,
    $setDraggingDisplayObject,
    $getDraggingDisplayObject
} from "../../DisplayObjectUtil";

describe("SpriteStartDragService.js test", () =>
{
    it("execute test", () =>
    {
        const sprite = new Sprite();

        $setDraggingDisplayObject(null);
        expect($getDraggingDisplayObject()).toBeNull();

        $pointer.x = 10;
        $pointer.y = 20;
        execute(sprite);

        expect(sprite.$lockCenter).toBe(false);
        expect(sprite.$offsetX).toBe(-10);
        expect(sprite.$offsetY).toBe(-20);
        expect($getDraggingDisplayObject()).toBe(sprite);

        $setDraggingDisplayObject(null);
        expect($getDraggingDisplayObject()).toBeNull();
    });
});