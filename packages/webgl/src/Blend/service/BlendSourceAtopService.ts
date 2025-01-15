import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードをソースアトップに設定します。
 *              Set the blend mode to source atop.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 673) {
        $setFuncCode(673);
        $gl.blendFunc($gl.DST_ALPHA, $gl.ONE_MINUS_SRC_ALPHA);
    }
};