import type { IBlendMode } from "../../interface/IBlendMode";

/**
 * @description ブレンドモードを数値に変換します。
 *              Converts the blend mode to a number.
 *
 * @param {IBlendMode} blend_mode
 * @return {number}
 * @method
 * @protected
 */
export const execute = (blend_mode: IBlendMode): number =>
{
    switch (blend_mode) {

        case "copy":
            return 0;

        case "add":
            return 1;

        case "alpha":
            return 2;

        case "darken":
            return 3;

        case "difference":
            return 4;

        case "erase":
            return 5;

        case "hardlight":
            return 6;

        case "invert":
            return 7;

        case "layer":
            return 8;

        case "lighten":
            return 9;

        case "multiply":
            return 10;

        case "normal":
            return 11;

        case "overlay":
            return 12;

        case "screen":
            return 13;

        case "subtract":
            return 14;
        
        default:
            return 11; // normal

    }
};