import { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";

/**
 * @description 指定された行のテキストを返します。
 *              Returns the text of a given line.
 * 
 * @param  {TextField} text_field
 * @param  {number} index 
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_field: TextField, index: number): string =>
{
    let text: string = "";

    const textData = textFieldGetTextDataUseCase(text_field);
    for (let idx = 1; idx < textData.textTable.length; idx++) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        if (textObject.line > index) {
            break;
        }

        if (textObject.line !== index) {
            continue;
        }

        if (textObject.mode !== "text") {
            continue;
        }

        text += textObject.text;
    }

    return text;
};