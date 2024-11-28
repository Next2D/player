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

    const textObject = textData.textTable[text_field.focusIndex];
    if (textObject) {
        const line = textObject.mode === "text"
            ? textObject.line
            : textObject.line - 1;

        const height = text_field.height;
        const scaleY = (text_field.textHeight - height) / height;

        let currentHeight = -text_field.scrollY * scaleY - 2;
        let endLine = 0;
        for (let idx = 0; idx < textData.heightTable.length; ++idx) {

            currentHeight += textData.heightTable[idx];
            if (currentHeight > height) {
                break;
            }

            endLine++;
        }

        if (line >= endLine) {
            text_field.scrollY += textData.heightTable[line] / scaleY;
        }

        const currentTextObject = textData.textTable[text_field.focusIndex - 1];
        const currentLine = currentTextObject.mode === "text"
            ? currentTextObject.line
            : currentTextObject.line - 1;

        if (currentTextObject && line > currentLine) {
            if (text_field.yScrollShape.hasLocalVariable("job")) {
                text_field.yScrollShape.deleteLocalVariable("job");
            }
            text_field.scrollX = 0;
            return ;
        }

        const width  = text_field.width;
        const scaleX = (text_field.textWidth - width) / width;

        let limitWidth = text_field.scrollX * scaleX - 2 + width;
        for (let idx = 1; text_field.focusIndex >= idx; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject || textObject.line > line) {
                break;
            }

            if (textObject.line !== line) {
                continue;
            }

            limitWidth -= textObject.w;
            if (limitWidth > 0) {
                continue;
            }

            if (text_field.yScrollShape.hasLocalVariable("job")) {
                text_field.yScrollShape.deleteLocalVariable("job");
            }
            text_field.scrollX += textObject.w / scaleX;
            break;
        }
        
    }
};