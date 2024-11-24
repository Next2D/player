import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカス位置を右に移動します。
 *              Moves the focus position of the text field to the right.
 *
 * @param  {TextField} text_field
 * @param  {boolean} shift_key
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, shift_key: boolean): void =>
{
    const textData = textFieldGetTextDataUseCase(text_field);
    if (textData.textTable.length === text_field.focusIndex) {
        return ;
    }

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

    // fixed logic
    text_field.focusVisible = false;
    text_field.focusIndex++;
    textFieldBlinkingClearTimeoutService();
    textFieldBlinkingUseCase(text_field);
};