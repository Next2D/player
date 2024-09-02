import type { ShaderManager } from "../../ShaderManager";
import {
    $context,
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
    const matrix = $context.$matrix;

    // vertex: u_offset
    highp[0] = 0;
    highp[1] = 0;

    // vertex: u_size
    highp[2] = width;
    highp[3] = height;

    // vertex: u_matrix
    highp[4]  = matrix[0];
    highp[5]  = matrix[1];
    highp[6]  = matrix[2];

    highp[8]  = matrix[3];
    highp[9]  = matrix[4];
    highp[10] = matrix[5];

    highp[12] = matrix[6];
    highp[13] = matrix[7];
    highp[14] = matrix[8];

    // vertex: u_viewport
    highp[7] = $getViewportWidth();
    highp[11] = $getViewportHeight();
};