import type { TextField } from "../../TextField";
import { $textArea } from "../../TextUtil";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldBlinkingClearTimeoutService } from "../../TextField/service/TextFieldBlinkingClearTimeoutService";
import { execute as textFieldBlinkingUseCase } from "../../TextField/usecase/TextFieldBlinkingUseCase";

/**
 * @description テキストフィールドのフォーカスインデックスを上に移動します。
 *              Moves the focus index of the text field up.
 *
 * @param  {TextField} text_field
 * @param  {boolean} shift_key
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, shift_key: boolean): void =>
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

        text_field.focusVisible = false;
        text_field.focusIndex  = 1;
        textFieldBlinkingClearTimeoutService();
        textFieldBlinkingUseCase(text_field);
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
            $textArea.style.top = `${$textArea.offsetTop - textObject.h}px`;
            text_field.focusVisible = false;
            text_field.focusIndex = textObject.mode === "text" ? idx - 1 : idx;
            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }

        if (textObject.line !== targetLine || textObject.mode !== "text") {
            continue;
        }

        textWidth += textObject.w;
        if (textWidth > currentWidth) {
            if (!shift_key) {
                text_field.selectIndex = -1;
            } else {
                if (text_field.selectIndex === -1) {
                    text_field.selectIndex = text_field.focusIndex - 1;
                } else {
                    if (text_field.selectIndex === idx + 1) {
                        text_field.selectIndex = -1;
                    }
                }
            }

            // fixed logic
            $textArea.style.top = `${$textArea.offsetTop - textObject.h}px`;
            text_field.focusVisible = false;
            text_field.focusIndex = idx + 1;
            textFieldBlinkingClearTimeoutService();
            textFieldBlinkingUseCase(text_field);
            return ;
        }
    }
};