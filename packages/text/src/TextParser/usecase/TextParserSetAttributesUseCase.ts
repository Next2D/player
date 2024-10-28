import type { TextFormat } from "../../TextFormat";
import type { IOptions } from "../../interface/IOptions";
import type { IAttributeObject } from "../../interface/IAttributeObject";
import type { ITextFormatAlign } from "../../interface/ITextFormatAlign";
import { $toColorInt } from "../../TextUtil";
import { execute as textParserParseStyleService } from "../service/TextParserParseStyleService";

/**
 * @description 属性を TextFormat に設定
 *              Set attributes to TextFormat
 * 
 * @param {IAttributeObject[]} attributes 
 * @param {TextFormat} text_format 
 * @param {IOptions} options
 * @method
 * @protected 
 */
export const execute = (
    attributes: IAttributeObject[],
    text_format: TextFormat,
    options: IOptions
): void => {

    for (let idx = 0; idx < attributes.length; ++idx) {

        const object: IAttributeObject = attributes[idx];
        switch (object.name) {

            case "style":
                execute(
                    textParserParseStyleService(object.value as string),
                    text_format,
                    options
                );
                break;

            case "align":
                text_format.align = object.value as ITextFormatAlign;
                break;

            case "face":
                text_format.font = object.value as string;
                break;

            case "size":
                text_format.size = +object.value;
                if (options.subFontSize) {
                    text_format.size -= options.subFontSize;
                    if (1 > text_format.size) {
                        text_format.size = 1;
                    }
                }
                break;

            case "color":
                text_format.color = $toColorInt(object.value);
                break;

            case "letterSpacing":
                text_format.letterSpacing = parseInt(object.value as string);
                break;

            case "leading":
                text_format.leading = parseInt(object.value as string);
                break;

            case "leftMargin":
                text_format.leftMargin = parseInt(object.value as string);
                break;

            case "rightMargin":
                text_format.rightMargin = parseInt(object.value as string);
                break;

            case "underline":
                text_format.underline = true;
                break;

            case "bold":
                text_format.bold = true;
                break;

            case "italic":
                text_format.italic = true;
                break;

            default:
                break;

        }
    }
};