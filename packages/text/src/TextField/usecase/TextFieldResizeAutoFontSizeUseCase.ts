import type { TextField } from "../../TextField";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";
import { execute as textFieldResetUseCase } from "./TextFieldResetUseCase";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";

/**
 * @description 現在の TextField のエリア内に収まる最大のフォントサイズを計算し、描画情報を生成します
 *              Calculates the maximum font size that will fit within the current TextField area and generates drawing information
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    let maxFontSize = 0;
    const textData = textFieldGetTextDataUseCase(text_field);
    for (let idx = 0; idx < textData.textTable.length; ++idx) {
        const textObject = textData.textTable[idx];
        maxFontSize = Math.max(maxFontSize, textObject.textFormat.size || 0);
    }

    let subSize = 1;
    if (text_field.width && text_field.textWidth) {

        while (maxFontSize > subSize
            && text_field.textWidth + 4 > text_field.width
        ) {
            textFieldResetUseCase(text_field);
            textFieldGetTextDataUseCase(text_field, subSize++);
        }

    }

    if (text_field.height && text_field.textHeight) {

        while (maxFontSize > subSize
            && text_field.textHeight + 4 > text_field.height
        ) {
            textFieldResetUseCase(text_field);
            textFieldGetTextDataUseCase(text_field, subSize++);
        }

    }

    // Apply changes
    textFieldApplyChangesService(text_field);
};