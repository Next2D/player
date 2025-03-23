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
    switch (true) {

        case source.font !== destination.font:
        case source.size !== destination.size:
        case source.color !== destination.color:
        case source.bold !== destination.bold:
        case source.italic !== destination.italic:
        case source.underline !== destination.underline:
        case source.align !== destination.align:
        case source.leftMargin !== destination.leftMargin:
        case source.rightMargin !== destination.rightMargin:
        case source.leading !== destination.leading:
        case source.letterSpacing !== destination.letterSpacing:
            return false;

        default:
            return true;

    }
};