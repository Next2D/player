import { $gridEnabled } from "../../../Grid";
import type { ShaderManager } from "../../ShaderManager";

/**
 * @description マスクの縦横サイズだけをuniform変数に設定します。
 *              Set only the vertical and horizontal size of the mask to the uniform variable.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager, width: number, height: number): void =>
{
    if (!$gridEnabled()) {
        return ;
    }

    const highp: Int32Array | Float32Array = shader_manager.highp;

    // vertex: u_matrix
    highp[0]  = 1;
    highp[1]  = 0;
    highp[2]  = 0;

    highp[4]  = 0;
    highp[5]  = 1;
    highp[6]  = 0;

    highp[8]  = 0;
    highp[9]  = 0;
    highp[10] = 1;

    // vertex: u_viewport
    highp[3] = width;
    highp[7] = height;
};