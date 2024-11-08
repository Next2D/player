import type { TextFormat } from "../../TextFormat";
import type { TextData } from "../../TextData";
import type { IOptions } from "../../interface/IOptions";
import type { Document, Element, ChildNode } from "domhandler";
import { execute as textParserParseTextUseCase } from "./TextParserParseTextUseCase";
import { execute as textParserCreateNewLineUseCase } from "./TextParserCreateNewLineUseCase";
import { execute as textParserSetAttributesUseCase } from "./TextParserSetAttributesUseCase";

/**
 * @description タグを解析してTextDataとTextFormatを設定
 *              Analyze tags and set TextData and TextFormat
 *
 * @param  {Document} document
 * @param  {TextFormat} text_format
 * @param  {TextData} text_data
 * @param  {IOptions} options
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    document: Document,
    text_format: TextFormat,
    text_data: TextData,
    options: IOptions
): void => {

    for (let idx = 0; idx < document.children.length; ++idx) {

        const node = document.children[idx] as ChildNode;

        if (node.nodeType === 3) {

            textParserParseTextUseCase(node.nodeValue || "", text_format, text_data, options);

            continue;

        }

        const textFormat = text_format.clone();
        switch ((node as Element).name.toUpperCase()) {

            case "DIV": // div tag
            case "P": // p tag
                textParserSetAttributesUseCase((node as Element).attributes, textFormat, options);

                if (options.multiline) {
                    textParserCreateNewLineUseCase(text_data, textFormat);
                }

                execute(node as Document, textFormat, text_data, options);

                continue;

            case "U": // underline
                textFormat.underline = true;
                break;

            case "B": // bold
                textFormat.bold = true;
                break;

            case "I": // italic
                textFormat.italic = true;
                break;

            case "FONT": // FONT tag
            case "SPAN": // SPAN tag
                textParserSetAttributesUseCase((node as Element).attributes, textFormat, options);
                break;

            case "BR":
                if (!options.multiline) {
                    continue;
                }
                textParserCreateNewLineUseCase(text_data, textFormat);
                break;

            default:
                break;

        }

        execute(node as Document, textFormat, text_data, options);
    }
};