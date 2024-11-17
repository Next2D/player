import type { DisplayObject } from "@next2d/display";
import { $stage } from "@next2d/display";
import { PointerEvent } from "@next2d/events";

/**
 * @description ポインターアップイベントを処理します。
 *              Processes the pointer up event.
 *
 * @param  {DisplayObject | null} display_object
 * @return {void}
 * @method
 * @protected
 */
export const execute = <D extends DisplayObject> (display_object: D | null = null): void =>
{
    if (display_object) {
        if (display_object.willTrigger(PointerEvent.POINTER_UP)) {
            display_object.dispatchEvent(
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