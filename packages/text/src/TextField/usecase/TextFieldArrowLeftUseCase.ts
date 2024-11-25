import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカスインデックスを左に移動します。
 *              Moves the focus index of the text field to the left.
 *
 * @param  {TextField} text_field
 * @param  {boolean} shift_key
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, shift_key: boolean): void =>
{
    if (!text_field.focusIndex) {
        return ;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    if (textData.textTable.length && text_field.focusIndex < 2) {
        text_field.focusIndex = 1;
        return ;
    }

    // fixed logic
    text_field.focusIndex--;

    if (!shift_key) {
        text_field.selectIndex = -1;
    } else {
        if (text_field.selectIndex === -1) {
            text_field.selectIndex = text_field.focusIndex;
        } else {
            if (text_field.selectIndex === text_field.focusIndex) {
                text_field.selectIndex = -1;
            }
        }
    }

    const textObject = textData.textTable[text_field.focusIndex];
    if (textObject) {
        const line = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        const height = text_field.height;
        const scaleY = (text_field.textHeight - height) / height;

        let currentHeight = -text_field.scrollY * scaleY - 2;
        let startLine = 0;
        for (let idx = 0; idx < textData.heightTable.length; ++idx) {

            currentHeight += textData.heightTable[idx];
            if (currentHeight > 0) {
                break;
            }

            startLine++;
        }

        if (startLine > line) {
            text_field.scrollY -= textData.heightTable[textObject.line] / scaleY;
        }
    }

    text_field.focusVisible = false;
    textFieldBlinkingClearTimeoutService();
    textFieldBlinkingUseCase(text_field);
};