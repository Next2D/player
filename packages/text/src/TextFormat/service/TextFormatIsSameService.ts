import type { TextFormat } from "../../TextFormat";

/**
 * @description TextFormat の比較
 *              TextFormat comparison
 * 
 * @param  {TextFormat} source 
 * @param  {TextFormat} destination 
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (source: TextFormat, destination: TextFormat): boolean =>
{
    if (source.font !== destination.font) {
        return false;
    }

    if (source.size !== destination.size) {
        return false;
    }

    if (source.color !== destination.color) {
        return false;
    }

    if (source.bold !== destination.bold) {
        return false;
    }

    if (source.italic !== destination.italic) {
        return false;
    }

    if (source.underline !== destination.underline) {
        return false;
    }

    if (source.align !== destination.align) {
        return false;
    }

    if (source.leftMargin !== destination.leftMargin) {
        return false;
    }

    if (source.rightMargin !== destination.rightMargin) {
        return false;
    }

    if (source.leading !== destination.leading) {
        return false;
    }

    if (source.letterSpacing !== destination.letterSpacing) {
        return false;
    }

    return true;
};