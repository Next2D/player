import type { TextFormat } from "../../TextFormat";
import type { IOptions } from "../../interface/IOptions";
import { TextData } from "../../TextData";
import { $setCurrentWidth } from "../../TextUtil";
import { execute as textParserCreateNewLineUseCase } from "./TextParserCreateNewLineUseCase";
import { execute as textParserParseTextUseCase } from "./TextParserParseTextUseCase";
import { execute as textParserAdjustmentHeightService } from "../service/TextParserAdjustmentHeightService";

/**
 * @description プレーンテキストを描画用に分解
 *              Decompose plain text for drawing
 * 
 * @param  {string} text
 * @param  {TextFormat} text_format
 * @param  {IOptions} options
 * @return {TextData}
 * @method
 * @protected
 */
export const execute = (
    text: string,
    text_format: TextFormat,
    options: IOptions
): TextData => {

    const textData: TextData = new TextData();
    if (!text) {
        return textData;
    }

    const lineText: string[] = options.multiline
        ? text.split("\n")
        : [text.replace("\n", "")];

    for (let idx = 0; idx < lineText.length; ++idx) {

        let textFormat = text_format.clone();
        if (options.textFormats) {
            textFormat = idx === 0
                ? options.textFormats[0]
                : options.textFormats.shift() as NonNullable<TextFormat>;
        }

        if (options.subFontSize
            && options.subFontSize > 0 && textFormat.size
        ) {
            textFormat.size -= options.subFontSize;
            if (1 > textFormat.size) {
                textFormat.size = 1;
            }
        }

        if (idx === 0 || options.wordWrap || options.multiline) {
            textParserCreateNewLineUseCase(textData, textFormat);
        }

        const texts = lineText[idx];
        if (!texts) {
            continue;
        }

        $setCurrentWidth(0);
        textParserParseTextUseCase(texts, textFormat, textData, options);
    }

    // 改行だけの行の高さを調整
    textParserAdjustmentHeightService(textData);

    return textData;
};