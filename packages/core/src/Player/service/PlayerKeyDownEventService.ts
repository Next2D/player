import { KeyboardEvent as Event, $setEvent } from "@next2d/events";
import { $stage } from "@next2d/display";

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
    $setEvent(event);
    $stage.dispatchEvent(new Event(Event.KEY_DOWN));
};