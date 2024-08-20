import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードをリセット
 *              Reset the blend mode
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 613) {
        $setFuncCode(613);
        $gl.blendFunc($gl.ONE, $gl.ONE_MINUS_SRC_ALPHA);
    }
};