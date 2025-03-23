import type { DisplayObject } from "@next2d/display";
import { $getRollOverDisplayObject } from "../../CoreUtil";
import {
    PointerEvent as Next2D_PointerEvent,
    $setEvent
} from "@next2d/events";

/**
 * @description マウス、タップがDisplayObjectから離れた時に発生します。
 *              Occurs when the mouse or tap leaves the DisplayObject.
 *
 * @param  {PointerEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: PointerEvent): void =>
{
    $setEvent(event);

    const rollOverDisplayObject = $getRollOverDisplayObject() as DisplayObject;
    if (!rollOverDisplayObject) {
        return ;
    }

    if (rollOverDisplayObject.willTrigger(Next2D_PointerEvent.POINTER_LEAVE)) {
        // イベントの伝播を止める
        event.preventDefault();

        rollOverDisplayObject.dispatchEvent(
            new Next2D_PointerEvent(Next2D_PointerEvent.POINTER_LEAVE)
        );
    }
};