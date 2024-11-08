import { $getBlinkingTimerId } from "../../TextUtil";

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
    clearTimeout($getBlinkingTimerId());
};