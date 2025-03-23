
import { $gl } from "../../WebGLUtil";

/**
 * @description アトラスへの描画終了
 *              End drawing to the atlas
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $gl.disable($gl.SCISSOR_TEST);
};
