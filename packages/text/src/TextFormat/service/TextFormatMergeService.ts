import type { TextFormat } from "../../TextFormat";

/**
 * @description TextFormat のマージ
 *              TextFormat merge
 * 
 * @param  {TextFormat} destination 
 * @param  {TextFormat} source 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (destination: TextFormat, source: TextFormat): void =>
{
    if (destination.align === null) {
        destination.align = source.align;
    }

    if (destination.bold === null) {
        destination.bold = source.bold;
    }

    if (destination.color === null) {
        destination.color = source.color;
    }

    if (destination.font === null) {
        destination.font = source.font;
    }

    if (destination.italic === null) {
        destination.italic = source.italic;
    }

    if (destination.leading === null) {
        destination.leading = source.leading;
    }

    if (destination.leftMargin === null) {
        destination.leftMargin = source.leftMargin;
    }

    if (destination.letterSpacing === null) {
        destination.letterSpacing = source.letterSpacing;
    }

    if (destination.rightMargin === null) {
        destination.rightMargin = source.rightMargin;
    }

    if (destination.size === null) {
        destination.size = source.size;
    }

    if (destination.underline === null) {
        destination.underline = source.underline;
    }
};