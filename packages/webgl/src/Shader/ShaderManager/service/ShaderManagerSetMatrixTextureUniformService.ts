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
export const execute = (
    shader_manager: ShaderManager,
    width: number, height: number
): void => {

    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    // vertex: u_offset
    highp[0] = matrix[0]; // a
    highp[1] = matrix[1]; // b
    highp[2] = matrix[3]; // c
    highp[3] = matrix[4]; // d
    highp[4] = matrix[6]; // tx
    highp[5] = matrix[7]; // ty

    // vertex: u_size
    highp[6] = width;
    highp[7] = height;

    // vertex: u_viewport
    highp[8] = $getViewportWidth();
    highp[9] = $getViewportHeight();
};