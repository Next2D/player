import type { DisplayObject } from "@next2d/display";
import { $stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";

/**
 * @description ポインターのダブルタップイベントを処理します。
 *              Processes the pointer double tap event.
 *
 * @param  {D | null} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (display_object: D | null = null): void =>
{
    if (display_object) {
        if (display_object.willTrigger(PointerEvent.DOUBLE_CLICK)) {
            display_object.dispatchEvent(
                new PointerEvent(PointerEvent.DOUBLE_CLICK)
            );
        }
    } else {
        if ($stage.willTrigger(PointerEvent.DOUBLE_CLICK)) {
            $stage.dispatchEvent(
                new PointerEvent(PointerEvent.DOUBLE_CLICK)
            );
        }
    }
};