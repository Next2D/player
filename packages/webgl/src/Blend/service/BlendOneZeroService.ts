import { $gl } from "../../WebGLUtil";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをOne/Zeroに設定します。
 *              Set the blend mode to One/Zero.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 610) {
        $setFuncCode(610);
        $gl.blendFunc($gl.ONE, $gl.ZERO);
    }
};