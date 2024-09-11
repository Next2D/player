import type { ShaderManager } from "../../ShaderManager";
import {
    $context,
    $inverseMatrix,
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerのBitmapの塗りのuniform変数を設定します。
 *              Set the fill uniform variables of the ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {boolean} has_grid
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager, 
    has_grid: boolean,
    width: number,
    height: number
): void =>
{
    const highp = shader_manager.highp;
    
    // vertex: u_matrix
    const matrix = $context.$stack[$context.$stack.length - 1];
    highp[0]  = matrix[0];
    highp[1]  = matrix[1];
    highp[2]  = matrix[2];

    highp[4]  = matrix[3];
    highp[5]  = matrix[4];
    highp[6]  = matrix[5];

    highp[8]  = matrix[6];
    highp[9]  = matrix[7];
    highp[10] = matrix[8];

    // vertex: u_inverse_matrix
    const inverseMatrix = $inverseMatrix($context.$matrix);
    highp[12] = inverseMatrix[0];
    highp[13] = inverseMatrix[1];
    highp[14] = inverseMatrix[2];

    highp[16] = inverseMatrix[3];
    highp[17] = inverseMatrix[4];
    highp[18] = inverseMatrix[5];

    highp[11] = inverseMatrix[6];
    highp[15] = inverseMatrix[7];
    highp[19] = inverseMatrix[8];

    // vertex: u_viewport
    highp[3] = $getViewportWidth();
    highp[7] = $getViewportHeight();

    let index = 20;
    if (has_grid) {
        index += 52;
    }

    const mediump = shader_manager.mediump;

    // fragment: u_uv
    mediump[0] = width;
    mediump[1] = height;
};