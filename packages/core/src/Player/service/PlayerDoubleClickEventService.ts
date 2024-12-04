import type { DisplayObject } from "@next2d/display";
import { stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";
import { $hitObject } from "../../CoreUtil";

/**
 * @description ポインターのダブルタップイベントを処理します。
 *              Processes the pointer double tap event.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (): void =>
{
    const displayObject = $hitObject.hit as D;
    if (displayObject) {
        if (displayObject.willTrigger(PointerEvent.DOUBLE_CLICK)) {
            displayObject.dispatchEvent(
                new PointerEvent(PointerEvent.DOUBLE_CLICK)
            );
        }
    } else {
        if (stage.willTrigger(PointerEvent.DOUBLE_CLICK)) {
            stage.dispatchEvent(
                new PointerEvent(PointerEvent.DOUBLE_CLICK)
            );
        }
    }
};