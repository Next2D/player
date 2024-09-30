import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードを消去に設定します。
 *              Set the blend mode to erase.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 603) {
        $setFuncCode(603);
        $gl.blendFunc($gl.ZERO, $gl.ONE_MINUS_SRC_ALPHA);
    }
};