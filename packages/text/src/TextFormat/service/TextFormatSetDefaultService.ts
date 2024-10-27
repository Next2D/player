import type { TextFormat } from "../../TextFormat";

/**
 * @description TextFormat のデフォルト設定を行います
 *              Set the default settings for TextFormat
 *
 * @param  {TextFormat} text_format
 * @return {void}
 * @method
 * @protected
 */
export const execute = (text_format: TextFormat): void =>
{
    text_format.align         = "left";
    text_format.bold          = false;
    text_format.color         = 0;
    text_format.font          = "Times New Roman";
    text_format.italic        = false;
    text_format.leading       = 0;
    text_format.leftMargin    = 0;
    text_format.letterSpacing = 0;
    text_format.rightMargin   = 0;
    text_format.size          = 12;
    text_format.underline     = false;
};