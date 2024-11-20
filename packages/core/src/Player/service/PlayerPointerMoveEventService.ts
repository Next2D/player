import type { DisplayObject } from "@next2d/display";
import { $getSelectedTextField } from "@next2d/text";
import { PointerEvent } from "@next2d/events";
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
    page_x: number = 0,
    page_y: number = 0
): void => {

    // text field
    const selectedTextField = $getSelectedTextField();
    if (selectedTextField && $player.mouseState === "down") {
        selectedTextField.setFocusIndex(
            $hitObject.x - $hitMatrix[4],
            $hitObject.y - $hitMatrix[5],
            true
        );

        return ;
    }

    const displayObject = $hitObject.hit as D;
    if (displayObject) {
        if (displayObject.willTrigger(PointerEvent.POINTER_MOVE)) {
            displayObject.dispatchEvent(new PointerEvent(
                PointerEvent.POINTER_MOVE
            ));
        }
    } else {
        // console.log(page_x, page_y);
    }
};