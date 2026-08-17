import type { TextField } from "../../TextField";
import { $textArea } from "../../TextUtil";
import { execute as textFieldGetTextDataUseCase } from "../../TextField/usecase/TextFieldGetTextDataUseCase";
import { execute as textFieldDeleteTextUseCase } from "../../TextField/usecase/TextFieldDeleteTextUseCase";
import { execute as textFieldInsertTextUseCase } from "../../TextField/usecase/TextFieldInsertTextUseCase";
import { execute as textFieldGetRestrictTextsService } from "../service/TextFieldGetRestrictTextsService";
import { execute as textFieldGetMaxCharsTextsService } from "../service/TextFieldGetMaxCharsTextsService";

/**
 * @description テキストフィールドのコンポジションエンドイベントを処理します。
 *              Processes the composition end event of the text field.
 *
 * @param  {TextField} text_field
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_field: TextField): void =>
{
    if (text_field.compositionEndIndex > -1) {

        const startIndex = text_field.compositionStartIndex;
        const endIndex   = text_field.compositionEndIndex;

        const textData = textFieldGetTextDataUseCase(text_field);

        // 確定した文字列を取得しつつ、変換中の下線を解除
        let confirmedTexts = "";
        for (let idx = startIndex; idx < endIndex; ++idx) {

            const textObject = textData.textTable[idx];
            if (!textObject) {
                continue;
            }

            textObject.textFormat.underline = false;

            switch (textObject.mode) {

                case "break":
                    confirmedTexts += "\n";
                    break;

                case "text":
                    confirmedTexts += textObject.text;
                    break;

                default:
                    continue;

            }
        }

        let insertTexts = textFieldGetRestrictTextsService(text_field, confirmedTexts);
        insertTexts = textFieldGetMaxCharsTextsService(
            text_field, insertTexts,
            text_field.text.length - confirmedTexts.length
        );

        if (insertTexts === confirmedTexts) {

            text_field.focusIndex = endIndex;

        } else {

            // restrict、maxChars の制限で確定文字列が変化した場合は、
            // 変換中の文字列を削除して制限後の文字列を挿入し直す
            text_field.compositionStartIndex = -1;
            text_field.compositionEndIndex   = -1;

            text_field.focusIndex  = startIndex;
            text_field.selectIndex = endIndex - 1;
            textFieldDeleteTextUseCase(text_field);

            if (insertTexts) {
                textFieldInsertTextUseCase(text_field, insertTexts);
            }
        }
    }

    $textArea.blur();
    $textArea.value = "";

    if (text_field.focus) {
        $textArea.focus();
    }

    text_field.selectIndex           = -1;
    text_field.compositionStartIndex = -1;
    text_field.compositionEndIndex   = -1;
};
