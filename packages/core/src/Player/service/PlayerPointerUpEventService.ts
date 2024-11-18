import type { DisplayObject } from "@next2d/display";
import { $stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";
import { $hitObject } from "../../CoreUtil";

/**
 * @description ポインターアップイベントを処理します。
 *              Processes the pointer up event.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (): void =>
{
    const displayObject = $hitObject.hit as D;
    if (displayObject) {
        if (displayObject.willTrigger(PointerEvent.POINTER_UP)) {
            displayObject.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_UP)
            );
        }
    } else {
        if ($stage.willTrigger(PointerEvent.POINTER_UP)) {
            $stage.dispatchEvent(
                new PointerEvent(PointerEvent.POINTER_UP)
            );
        }
    }
};