import type { ShaderManager } from "../../ShaderManager";
import { $gridEnabled } from "../../../Grid";
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
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager, 
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
    const isGridEnabled = $gridEnabled();
    if (isGridEnabled) {
        index += 52;
    }
    let face: number = Math.sign(matrix[0] * matrix[4]);
    if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
        face = -Math.sign(matrix[1] * matrix[3]);
    }

    let halfWidth: number = $context.thickness * 0.5;
    let scaleX: number;
    let scaleY: number;
    if (isGridEnabled) {
        // todo
        scaleX = 1;
        scaleY = 1;
    } else {
        scaleX = Math.abs(matrix[0] + matrix[3]);
        scaleY = Math.abs(matrix[1] + matrix[4]);
    }

    const scaleMin: number = Math.min(scaleX, scaleY);
    const scaleMax: number = Math.max(scaleX, scaleY);
    halfWidth *= scaleMax * (1 - 0.3 * Math.cos(Math.PI * 0.5 * (scaleMin / scaleMax)));
    halfWidth = Math.max(1, halfWidth);
    
    // vertex: u_half_width
    highp[index] = halfWidth;

    // vertex: u_face
    highp[index + 1] = face;

    // vertex: u_miter_limit
    highp[index + 2] = $context.miterLimit;

    const mediump = shader_manager.mediump;

    // fragment: u_uv
    mediump[0] = width;
    mediump[1] = height;
};