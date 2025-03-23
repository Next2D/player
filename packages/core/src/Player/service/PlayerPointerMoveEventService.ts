import type { DisplayObject, Sprite } from "@next2d/display";
import { stage } from "@next2d/display";
import { $getSelectedTextField } from "@next2d/text";
import { PointerEvent } from "@next2d/events";
import { $player } from "../../Player";
import {
    $hitObject,
    $hitMatrix,
    $setRollOverDisplayObject,
    $getRollOverDisplayObject,
    $clamp
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
    const dropTarget = stage.dropTarget as Sprite | null;
    if (dropTarget) {

        const point = dropTarget.parent
            ? dropTarget.parent.globalToLocal(stage.pointer)
            : dropTarget.globalToLocal(stage.pointer);

        let dragX = 0;
        let dragY = 0;

        if (!(dropTarget as Sprite).$lockCenter) {
            dragX = point.x + (dropTarget as Sprite).$offsetX;
            dragY = point.y + (dropTarget as Sprite).$offsetY;
        } else {
            dragX = point.x - dropTarget.width  / 2;
            dragY = point.y - dropTarget.height / 2;
        }

        const bounds = (dropTarget as Sprite).$boundedRect;
        if (bounds) {
            dragX = $clamp(dragX, bounds.left, bounds.right);
            dragY = $clamp(dragY, bounds.top, bounds.bottom);
        }

        // set move xy
        dropTarget.x = dragX;
        dropTarget.y = dragY;
    }

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

        if (stage.hasEventListener(PointerEvent.POINTER_MOVE)) {
            stage.dispatchEvent(new PointerEvent(
                PointerEvent.POINTER_MOVE
            ));
        }
    }
};