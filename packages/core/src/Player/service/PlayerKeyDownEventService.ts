import { $stage } from "@next2d/display";
import {
    KeyboardEvent as Event,
    $setEvent
} from "@next2d/events";

/**
 * @description キーボードダウンイベントを実行する
 *              Execute the keyboard down event
 *
 * @param  {KeyboardEvent} event
 * @return {void}
 * @method
 * @protected
 */
export const execute = (event: KeyboardEvent): void =>
{
    if (!$stage.hasEventListener(Event.KEY_DOWN)) {
        return ;
    }

    $setEvent(event);
    $stage.dispatchEvent(new Event(Event.KEY_DOWN));
};