import { stage } from "@next2d/display";
import { $getSelectedTextField } from "@next2d/text";
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
    const selectedTextField = $getSelectedTextField();
    if (selectedTextField) {
        selectedTextField.keyDown(event);
        return ;
    }

    if (!stage.hasEventListener(Event.KEY_DOWN)) {
        return ;
    }

    $setEvent(event);
    stage.dispatchEvent(new Event(Event.KEY_DOWN));
};