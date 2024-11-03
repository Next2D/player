import type { TextField } from "../../TextField";
import { $textArea } from "../../TextUtil";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";

/**
 * @description テキストフィールドのコンポジションエンドイベントを処理します。
 *              Processes the composition end event of the text field.
 * 
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    if (text_field.compositionEndIndex > -1) {

        const textData = textFieldGetTextDataUseCase(text_field);
        for (let idx = text_field.compositionStartIndex; idx < text_field.compositionEndIndex; ++idx) {
            const textObject = textData.textTable[idx];
            if (!textObject) {
                continue;
            }
            textObject.textFormat.underline = false;
        }

        text_field.focusIndex = text_field.compositionEndIndex;
    }

    $textArea.blur();
    $textArea.value = "";

    if (text_field.focus) {
        $textArea.focus();
    }

    text_field.selectIndex           = -1;
    text_field.compositionStartIndex = -1;
    text_field.compositionEndIndex   = -1;
};