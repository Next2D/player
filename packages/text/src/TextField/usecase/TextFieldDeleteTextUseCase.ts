import type { TextField } from "../../TextField";
import type { TextFormat } from "../../TextFormat";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";

/**
 * @description 選択中のテキストを削除します。
 *              Deletes the selected text.
 *
 * @param  {TextField} text_field 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    if (text_field.compositionStartIndex > -1) {
        return ;
    }

    let minIndex = 0;
    let maxIndex = 0;
    if (text_field.selectIndex > -1) {
        minIndex = Math.min(text_field.focusIndex, text_field.selectIndex);
        maxIndex = Math.max(text_field.focusIndex, text_field.selectIndex) + 1;
        text_field.focusIndex = minIndex;
    } else {
        if (2 > text_field.focusIndex) {
            return ;
        }

        text_field.focusIndex--;
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    const textObject = textData.textTable[text_field.focusIndex];
    if (textObject && textObject.mode === "wrap") {
        text_field.focusIndex--;
    }

    const textFormats: TextFormat[] = [];

    let newText = "";
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (text_field.focusIndex === idx
            || minIndex <= idx && maxIndex > idx
        ) {
            continue;
        }

        switch (textObject.mode) {

            case "break":
                textFormats.push(textObject.textFormat);
                newText += "\n";
                break;

            case "text":
                textFormats.push(textObject.textFormat);
                newText += textObject.text;
                break;

            default:
                continue;

        }
    }

    if (textData.textTable.length === text_field.focusIndex) {
        textFormats.pop();
        newText = newText.slice(0, -1);
    }

    text_field.selectIndex = -1;
    if (!newText) {
        // reset
        text_field.text = "";
        text_field.focusIndex = 0;
    } else {

        const beforeTextWidth  = text_field.textWidth;
        const beforeTextHeight = text_field.textHeight;

        // fixed logic
        text_field.$textFormats = textFormats;

        // fixed logic
        text_field.text = newText;

        if (text_field.scrollX > 0) {
            const textWidth = text_field.textWidth;
            const width = text_field.width;

            switch (true) {

                case width > textWidth:
                    text_field.$scrollX = 0;
                    break;

                case beforeTextWidth !== textWidth:
                    text_field.$scrollX -= (beforeTextWidth - textWidth)
                        / (textWidth / width);
                    break;

                default:
                    break;

            }
        }

        if (text_field.scrollY > 0) {
            const textHeight = text_field.textHeight;
            const height = text_field.height;

            switch (true) {

                case height > textHeight:
                    text_field.$scrollY = 0;
                    break;

                case beforeTextHeight !== textHeight:
                    text_field.$scrollY -= (beforeTextHeight - textHeight)
                        / (textHeight / height);
                    break;

                default:
                    break;

            }
        }

        // fixed logic
        text_field.$textFormats = null;
    }
};