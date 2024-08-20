import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードをスクリーンに設定します。
 *              Set the blend mode to screen.
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 641) {
        $setFuncCode(641);
        $gl.blendFunc($gl.ONE_MINUS_DST_COLOR, $gl.ONE);
    }
};