import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカス位置を右に移動します。
 *              Moves the focus position of the text field to the right.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    const textData = textFieldGetTextDataUseCase(text_field);
    if (textData.textTable.length === text_field.focusIndex) {
        return ;
    }

    text_field.focusIndex++;
    text_field.selectIndex = -1;
    textFieldBlinkingClearTimeoutService();
    textFieldBlinkingUseCase(text_field);
};