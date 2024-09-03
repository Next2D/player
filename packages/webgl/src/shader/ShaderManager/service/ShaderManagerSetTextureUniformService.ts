import type { ShaderManager } from "../../ShaderManager";
import {
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerのTextureのuniform変数を設定します。
 *              Set the Texture uniform variables of the ShaderManager.
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
    const highp = shader_manager.highp;

    // vertex: u_offset
    highp[0] = 0;
    highp[1] = 0;

    // vertex: u_size
    highp[2] = width;
    highp[3] = height;

    // vertex: u_matrix
    highp[4]  = 1;
    highp[9]  = 1;
    highp[14] = 1;

    // vertex: u_viewport
    highp[7]  = $getViewportWidth();
    highp[11] = $getViewportHeight();
};