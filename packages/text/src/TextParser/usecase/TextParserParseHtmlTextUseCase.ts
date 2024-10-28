import type { TextFormat } from "../../TextFormat";
import type { IOptions } from "../../interface/IOptions";
import { TextData } from "../../TextData";
import { parseDocument } from "htmlparser2";
import { execute as textParserCreateNewLineUseCase } from "./TextParserCreateNewLineUseCase";
import { execute as textParserAdjustmentHeightService } from "../service/TextParserAdjustmentHeightService";
import { execute as textParserParseTagUseCase } from "./TextParserParseTagUseCase";

/**
 * @description HTMLテキストを解析してTextDataを生成
 *              Analyze HTML text and generate TextData
 * 
 * @param  {string} html_text
 * @param  {TextFormat} text_format
 * @param  {IOptions} options
 * @return {TextData}
 * @method
 * @protected
 */
export const execute = (
    html_text: string,
    text_format: TextFormat,
    options: IOptions
): TextData => {

    const textData: TextData = new TextData();
    if (!html_text) {
        return textData;
    }

    const htmlText: string = html_text
        .trim()
        .replace(/\r?\n/g, "")
        .replace(/\t/g, "");

    const textFormat = text_format.clone();
    if (options.subFontSize && options.subFontSize > 0 && textFormat.size) {
        textFormat.size -= options.subFontSize;
        if (1 > textFormat.size) {
            textFormat.size = 1;
        }
    }

    textParserCreateNewLineUseCase(textData, textFormat);

    textParserParseTagUseCase(
        parseDocument(htmlText), textFormat, textData, options
    );

    textParserAdjustmentHeightService(textData);

    return textData;
};