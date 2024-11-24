import type { TextField } from "@next2d/text";
import { execute as textFieldApplyChangesService } from "../service/TextFieldApplyChangesService";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";

/**
 * @description テキストフィールドの全選択を実行する
 *              Execute the text field's select all
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    const textData = textFieldGetTextDataUseCase(text_field);
    if (2 > textData.textTable.length) {
        return ;
    }

    text_field.selectIndex = 1;
    text_field.focusIndex  = textData.textTable.length;
    textFieldApplyChangesService(text_field);
};