import type { ShaderManager } from "../../ShaderManager";
import {
    $context,
    $getViewportHeight,
    $getViewportWidth
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
    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    // vertex: u_offset
    highp[0] = matrix[6]; // x
    highp[1] = matrix[7]; // y

    // vertex: u_size
    highp[2] = width;
    highp[3] = height;

    // vertex: u_viewport
    highp[4] = $getViewportWidth();
    highp[5] = $getViewportHeight();
};