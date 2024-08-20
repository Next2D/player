import {
    $setFuncCode,
    $getFuncCode
} from "../../Blend";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードを加算に設定します。
 *              Set the blend mode to add.
 * 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    if ($getFuncCode() !== 611) {
        $setFuncCode(611);
        $gl.blendFunc($gl.ONE, $gl.ONE);
    }
};