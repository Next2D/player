import type { DisplayObject } from "@next2d/display";
import { $stage } from "@next2d/display";
import { $getSelectedTextField } from "@next2d/text";
import { PointerEvent } from "@next2d/events";
import { $player } from "../../Player";
import {
    $hitObject,
    $hitMatrix,
    $setRollOverDisplayObject,
    $getRollOverDisplayObject
} from "../../CoreUtil";

/**
 * @description ポインタームーブイベントを処理します。
 *              Processes the pointer move event.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (): void =>
{

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

    const rollOverDisplayObject = $getRollOverDisplayObject();
    const displayObject = $hitObject.hit as D;
    if (displayObject) {

        // pointerMove
        if (displayObject.willTrigger(PointerEvent.POINTER_MOVE)) {
            displayObject.dispatchEvent(new PointerEvent(
                PointerEvent.POINTER_MOVE
            ));
        }

        // rollOut and rollOver
        if (rollOverDisplayObject) {

            if (rollOverDisplayObject.instanceId !== displayObject.instanceId) {

                // rollOut
                if (rollOverDisplayObject.willTrigger(PointerEvent.POINTER_OUT)) {
                    rollOverDisplayObject.dispatchEvent(new PointerEvent(
                        PointerEvent.POINTER_OUT
                    ));
                }

                // rollOver
                if (displayObject.willTrigger(PointerEvent.POINTER_OVER)) {
                    displayObject.dispatchEvent(new PointerEvent(
                        PointerEvent.POINTER_OVER
                    ));
                }
            }

        } else {
            // rollOver
            if (displayObject.willTrigger(PointerEvent.POINTER_OVER)) {
                displayObject.dispatchEvent(new PointerEvent(
                    PointerEvent.POINTER_OVER
                ));
            }
        }

        // set rollOver DisplayObject
        $setRollOverDisplayObject(displayObject);

    } else {

        // rollOut
        if (rollOverDisplayObject) {
            if (rollOverDisplayObject.willTrigger(PointerEvent.POINTER_OUT)) {
                rollOverDisplayObject.dispatchEvent(new PointerEvent(
                    PointerEvent.POINTER_OUT
                ));
            }
            $setRollOverDisplayObject(null);
        }

        if ($stage.hasEventListener(PointerEvent.POINTER_MOVE)) {
            $stage.dispatchEvent(new PointerEvent(
                PointerEvent.POINTER_MOVE
            ));
        }
    }
};