import { execute } from "./SpriteStopDragService";
import { Sprite } from "../../Sprite";
import { describe, expect, it } from "vitest";
import {
    $pointer,
    $setDraggingDisplayObject,
    $getDraggingDisplayObject
} from "../../DisplayObjectUtil";

describe("SpriteStopDragService.js test", () =>
{
    it("execute test", () =>
    {
        const sprite = new Sprite();

        $setDraggingDisplayObject(sprite);
        expect($getDraggingDisplayObject()).toBe(sprite);

        sprite.$offsetX = 10;
        sprite.$offsetY = 20;

        execute(sprite);

        expect(sprite.$lockCenter).toBe(false);
        expect(sprite.$offsetX).toBe(0);
        expect(sprite.$offsetY).toBe(0);
        expect($getDraggingDisplayObject()).toBeNull();
    });
});