import { $stage } from "@next2d/display";
import {
    $setEvent,
    WheelEvent as Next2D_WheelEvent
} from "@next2d/events";

/**
 * @description ホイールイベントを実行します。
 *              Executes the wheel event.
 *
 * @param  {WheelEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: WheelEvent): void =>
{
    $setEvent(event);
    if ($stage.willTrigger(Next2D_WheelEvent.WHEEL)) {
        // イベントの伝播を止める
        event.preventDefault();

        $stage.dispatchEvent(new Next2D_WheelEvent(
            Next2D_WheelEvent.WHEEL
        ));
    }
};