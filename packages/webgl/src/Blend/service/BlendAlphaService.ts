import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードをアルファに設定します。
 *              Set the blend mode to alpha.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 606) {
        $setFuncCode(606);
        $gl.blendFunc($gl.ZERO, $gl.SRC_ALPHA);
    }
};