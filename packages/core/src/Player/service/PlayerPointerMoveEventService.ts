import type { DisplayObject } from "@next2d/display";
import type { TextField } from "@next2d/text";
import { $player } from "../../Player";
import {
    $hitObject,
    $hitMatrix
} from "../../CoreUtil";

/**
 * @description ポインタームーブイベントを処理します。
 *              Processes the pointer move event.
 *
 * @param  {D | null} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (
    display_object: D | null = null,
    page_x: number = 0,
    page_y: number = 0
): void => {

    console.log(page_x, page_y);
    if (display_object) {
        if (display_object.isText && $player.mouseState === "down") {
            (display_object as unknown as TextField).setFocusIndex(
                $hitObject.x - $hitMatrix[4],
                $hitObject.y - $hitMatrix[5],
                true
            );
        }
    }
};