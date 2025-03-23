import type { TextField } from "../../TextField";

/**
 * @description コピーしたテキストをペーストします。
 *              Pastes the copied text.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = async (text_field: TextField): Promise<void> =>
{
    const text = await navigator.clipboard.readText();
    if (text === "" || text_field.focusIndex === -1) {
        return ;
    }

    text_field.insertText(text);
};