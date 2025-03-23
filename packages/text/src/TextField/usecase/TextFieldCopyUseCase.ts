import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";

/**
 * @description テキストフィールドの選択範囲のテキストを返却します。
 *              Returns the text of the selection in the text field.
 *
 * @param  {TextField} text_field
 * @return {Promise<void>}
 * @method
 * @protected
 */
export const execute = async (text_field: TextField): Promise<void> =>
{
    if (text_field.focusIndex === -1 || text_field.selectIndex === -1) {
        return ;
    }

    let text = "";

    const minIndex = Math.min(text_field.focusIndex, text_field.selectIndex);
    const maxIndex = Math.max(text_field.focusIndex, text_field.selectIndex) + 1;

    const textData = textFieldGetTextDataUseCase(text_field);
    for (let idx = minIndex; idx < maxIndex; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        switch (textObject.mode) {

            case "text":
                text += textObject.text;
                break;

            case "break":
                text += "\n";
                break;

            default:
                break;

        }
    }

    await navigator
        .clipboard
        .writeText(text);
};