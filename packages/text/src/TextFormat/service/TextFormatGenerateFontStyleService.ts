import type { TextFormat } from "../../TextFormat";

/**
 * @description テキストフォーマットからフォントスタイルを生成
 *              Generate font style from text format
 * 
 * @param  {TextFormat} text_frmat
 * @return {string}
 * @method
 * @protected
 */
export const execute = (text_frmat: TextFormat): string =>
{
    let fontStyle = "";
    if (text_frmat.italic) {
        fontStyle = "italic ";
    }
    if (text_frmat.bold) {
        fontStyle += "bold ";
    }

    return `${fontStyle}${text_frmat.size}px '${text_frmat.font}',sans-serif`;
};