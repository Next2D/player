import type { TextData } from "../../TextData";
import type { TextField } from "../../TextField";
import { execute as textParserParseHtmlTextUseCase } from "../../TextParser/usecase/TextParserParseHtmlTextUseCase";

/**
 * @description テキスト情報を元に描画用のデータを生成して返します。
 *              生成済みのデータがある場合は、そのデータを返します。
 *              Generates and returns data for drawing based on text information.
 *              If data has already been generated, that data is returned.
 *
 * @param  {TextField} text_field 
 * @param  {TextFormat[]} [text_formats=null] 
 * @param  {number} sub_font_size 
 * @return {TextData}
 * @method
 * @protected
 */
export const execute = (
    text_field: TextField,
    sub_font_size: number = 0
): TextData => {

    if (text_field.$textData) {
        return text_field.$textData;
    }

    text_field.$textData = textParserParseHtmlTextUseCase(
        text_field.htmlText,
        text_field.defaultTextFormat,
        {
            "width": text_field.width,
            "multiline": text_field.multiline,
            "wordWrap": text_field.wordWrap,
            "subFontSize": sub_font_size
        }
    );

    return text_field.$textData;
};