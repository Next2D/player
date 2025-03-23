import type { TextFormat } from "../../TextFormat";
import {
    $intToRGBA,
    $toColorInt
} from "../../TextUtil";

/**
 * @description テキストフォーマットをHTMLのstyle属性に変換します。
 *              Converts text format to the style attribute of HTML.
 *
 * @param  {TextFormat} text_format
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_format: TextFormat): string =>
{
    let style: string = "";

    if (text_format.font) {
        style += `font-family: ${text_format.font};`;
    }

    if (text_format.size) {
        style += `font-size: ${text_format.size}px;`;
    }

    if (text_format.color) {
        const color = $intToRGBA($toColorInt(text_format.color));
        const R: string = color.R.toString(16).padStart(2, "0");
        const G: string = color.G.toString(16).padStart(2, "0");
        const B: string = color.B.toString(16).padStart(2, "0");
        style += `color: #${R}${G}${B};`;
    }

    if (text_format.bold) {
        style += "font-weight: bold;";
    }

    if (text_format.italic) {
        style += "font-style: italic;";
    }

    if (text_format.underline) {
        style += "text-decoration: underline;";
    }

    if (text_format.align) {
        style += `text-align: ${text_format.align};`;
    }

    if (text_format.leftMargin) {
        style += `margin-left: ${text_format.leftMargin}px;`;
    }

    if (text_format.rightMargin) {
        style += `margin-right: ${text_format.rightMargin}px;`;
    }

    if (text_format.leading) {
        style += `margin-bottom: ${text_format.leading}px;`;
    }

    if (text_format.letterSpacing) {
        style += `letter-spacing: ${text_format.letterSpacing}px;`;
    }

    return style;
};