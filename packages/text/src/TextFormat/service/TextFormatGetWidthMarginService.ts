import type { TextFormat } from "../../TextFormat";

/**
 * @description テキストフォーマットから幅のマージンを取得
 *              Get width margin from text format
 * 
 * @param  {TextFormat} text_format
 * @return {number}
 * @method
 * @protected
 */
export const execute = (text_format: TextFormat): number =>
{
    let width = 0;

    if (text_format.leftMargin) {
        width += text_format.leftMargin;
    }

    if (text_format.rightMargin) {
        width += text_format.rightMargin;
    }

    return width;
};