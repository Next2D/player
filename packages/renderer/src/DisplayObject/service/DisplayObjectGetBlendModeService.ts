import type { IBlendMode } from "../../../../webgl/src/interface/IBlendMode";

/**
 * @description ブレンドモードを取得します。
 *              Get the blend mode.
 * 
 * @param  {number} blend_number 
 * @return {IBlendMode}
 * @method
 * @protected
 */
export const execute = (blend_number: number): IBlendMode =>
{
    switch (blend_number) {

        case 0:
            return "copy";

        case 1:
            return "add";

        case 2:
            return "alpha";

        case 3:
            return "darken";

        case 4:
            return "difference";

        case 5:
            return "erase";

        case 6:
            return "hardlight";

        case 7:
            return "invert";

        case 8:
            return "layer";

        case 9:
            return "lighten";

        case 10:
            return "multiply";

        case 11:
            return "normal";

        case 12:
            return "overlay";

        case 13:
            return "screen";

        case 14:
            return "subtract";
        
        default:
            return "normal"; // normal
            
    }
};