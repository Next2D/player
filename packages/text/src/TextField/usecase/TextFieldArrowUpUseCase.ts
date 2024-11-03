import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカスインデックスを上に移動します。
 *              Moves the focus index of the text field up.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    if (text_field.focusIndex === -1) {
        return ;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        return ;
    }

    const index = textData.textTable.length === text_field.focusIndex
        ? text_field.focusIndex - 1
        : text_field.focusIndex;

    const textObject = textData.textTable[index];
    if (!textObject || !textObject.line) {
        return ;
    }

    const line = textObject.mode === "text"
        ? textObject.line
        : textObject.line - 1;

    let currentWidth = 2;
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (text_field.focusIndex === idx) {
            if (textObject.mode === "text") {
                currentWidth +=  textObject.w / 2;
            }
            break;
        }

        if (textObject.line > line) {
            break;
        }

        if (textObject.line !== line || textObject.mode !== "text") {
            continue;
        }

        currentWidth += textObject.w;
    }

    let textWidth = 2;
    const targetLine = line - 1;
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (textObject.line > targetLine) {
            text_field.focusIndex  = textObject.mode === "text" ? idx - 1 : idx;
            text_field.selectIndex = -1;
            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }

        if (textObject.line !== targetLine || textObject.mode !== "text") {
            continue;
        }

        textWidth += textObject.w;
        if (textWidth > currentWidth) {
            text_field.focusIndex  = idx;
            text_field.selectIndex = -1;
            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }
    }
};