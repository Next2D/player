import type { TextField } from "../../TextField";
import { execute as textFieldResetUseCase } from "./TextFieldResetUseCase";
import { execute as textFieldGetTextDataUseCase } from "./TextFieldGetTextDataUseCase";
import { execute as textFieldResizeUseCase } from "./TextFieldResizeUseCase";
import { execute as textFieldResizeAutoFontSizeUseCase } from "./TextFieldResizeAutoFontSizeUseCase";

/**
 * @description テキストフィールドの描画生成情報を再計算します
 *              Recalculates the drawing generation information of the text field
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    // 初期化
    textFieldResetUseCase(text_field);

    // 描画情報を生成
    textFieldGetTextDataUseCase(text_field);

    // テキストフィールドの自動フォントサイズ設定がonならば、自動フォントサイズを適用する
    if (text_field.autoSize === "none" && text_field.autoFontSize) {
        textFieldResizeAutoFontSizeUseCase(text_field);
    }

    // テキストエリアをリサイズ
    textFieldResizeUseCase(text_field);
};