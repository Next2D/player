import type { ITextFormat } from "../../interface/ITextFormat";

/**
 * @description テキストフォーマットを元にフォントスタイルを生成します。
 *              Generate font style based on text format.
 *
 * @param  {ITextFormat} text_format
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_format: ITextFormat): string =>
{
    let fontStyle = "";

    if (text_format.italic) {
        fontStyle += "italic ";
    }

    if (text_format.bold) {
        fontStyle += "bold ";
    }

    return `${fontStyle}${text_format.size}px '${text_format.font}','sans-serif'`;
};