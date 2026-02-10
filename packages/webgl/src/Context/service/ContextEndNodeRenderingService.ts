
import { $disableScissorTest } from "../../WebGLUtil";

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
    $disableScissorTest();
};
