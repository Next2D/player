import { $gl } from "../../WebGLUtil";
import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";

/**
 * @description ブレンドモードをソースインに設定します。
 *              Set the blend mode to source in.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 670) {
        $setFuncCode(670);
        $gl.blendFunc($gl.DST_ALPHA, $gl.ZERO);
    }
};