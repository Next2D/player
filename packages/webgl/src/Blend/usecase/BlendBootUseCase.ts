import { execute as blendResetService } from "../service/BlendResetService";
import { $gl } from "../../WebGLUtil";

/**
 * @description ブレンドモードを起動する
 *              Start the blend mode.
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    $gl.enable($gl.BLEND);
    blendResetService();
};