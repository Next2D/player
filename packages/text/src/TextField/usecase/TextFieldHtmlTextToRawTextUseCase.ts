import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";

/**
 * @description HTMLテキストをプレーンテキストに変換します。
 *              Convert HTML text to plain text.
 *
 * @param  {TextField} text_field
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): string =>
{
    let text = "";
    const textData = textFieldGetTextDataUseCase(text_field);
    for (let idx = 1; idx < textData.textTable.length; ++idx) {

        const textObject = textData.textTable[idx];
        if (!textObject) {
            continue;
        }

        switch (textObject.mode) {

            case "text":
                text += textObject.text;
                break;

            case "break":
                text += "\r";
                break;

            default:
                continue;

        }
    }

    return text;
};