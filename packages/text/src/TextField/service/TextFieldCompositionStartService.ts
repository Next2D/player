import type { TextField } from "../../TextField";

/**
 * @description 選択中のインデックスを記録します。
 *              Records the currently selected index.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    text_field.compositionStartIndex = text_field.focusIndex;
};