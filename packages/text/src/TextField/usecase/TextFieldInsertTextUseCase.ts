import type { TextField } from "../../TextField";
import type { TextFormat } from "../../TextFormat";
import { $textArea } from "../../TextUtil";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";

/**
 * @description TextField にテキストを挿入します。
 *              Inserts text into the TextField.
 *
 * @param  {TextField} text_field 
 * @param  {string} texts 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, texts: string): void =>
{
    if (text_field.focusIndex === -1
        || text_field.compositionStartIndex > -1
    ) {
        return ;
    }

    if (text_field.selectIndex > -1) {
        textFieldDeleteTextUseCase(text_field);
    }

    const textData = textFieldGetTextDataUseCase(text_field);
    
    const textFormats: TextFormat[] = [];

    let newText = "";
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (text_field.focusIndex === idx) {
            for (let idx = 0; idx < texts.length; ++idx) {
                textFormats.push(textObject.textFormat);
                newText += texts[idx];
            }
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

        let textFormat: TextFormat;
        if (textData.textTable.length) {
            const textObject = textData.textTable[textData.textTable.length - 1];
            textFormat = textObject.textFormat.clone();
        } else {
            textFormat = text_field.defaultTextFormat;
            text_field.focusIndex++;
        }

        for (let idx = 0; idx < texts.length; ++idx) {
            textFormats.push(textFormat.clone());
            newText += texts[idx];
        }
    }

    // fixed logic
    text_field.$textFormats = textFormats;

    // fixed logic
    text_field.text = newText;

    // fixed logic
    text_field.$textFormats = null;

    text_field.focusIndex += texts.length;
    text_field.selectIndex = -1;

    $textArea.value = "";
};