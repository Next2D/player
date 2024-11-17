import {
    $getBlinkingTimerId,
    $setBlinkingTimerId
} from "../../TextUtil";

/**
 * @description テキストの点滅のタイマーをクリアします。
 *              Clear the text blinking timer.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    const timerId = $getBlinkingTimerId();
    if (timerId !== undefined) {
        clearTimeout(timerId);
    }
    $setBlinkingTimerId(void 0);
};