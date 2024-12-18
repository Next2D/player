import type { ShaderManager } from "../../ShaderManager";
import {
    $context,
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerの線のuniform変数を設定します。
 *              Set the line uniform variables of ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {Float32Array | null} [grid_data=null]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager, grid_data: Float32Array | null): void =>
{
    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    // vertex: u_viewport
    highp[3] = $getViewportWidth();
    highp[7] = $getViewportHeight();

    let index = 0;
    if (!grid_data) {
        // vertex: u_matrix
        highp[0]  = matrix[0];
        highp[1]  = matrix[1];
        highp[2]  = matrix[2];

        highp[4]  = matrix[3];
        highp[5]  = matrix[4];
        highp[6]  = matrix[5];

        highp[8]  = matrix[6];
        highp[9]  = matrix[7];
        highp[10] = matrix[8];

        index = 12;
    } else {

        // vertex: u_parent_matrix
        highp[0]  = grid_data[0];
        highp[1]  = grid_data[1];
        highp[2]  = 0;

        highp[4]  = grid_data[2];
        highp[5]  = grid_data[3];
        highp[6]  = 0;

        highp[8]  = grid_data[4];
        highp[9]  = grid_data[5];
        highp[10] = 1;

        // vertex: u_ancestor_matrix
        highp[12] = grid_data[6];
        highp[13] = grid_data[7];
        highp[14] = 0;

        highp[16] = grid_data[8];
        highp[17] = grid_data[9];
        highp[18] = 0;

        highp[20] = grid_data[10];
        highp[21] = grid_data[11];
        highp[22] = 1;

        // vertex: u_parent_viewport
        highp[11] = grid_data[12];
        highp[15] = grid_data[13];
        highp[19] = grid_data[14];
        highp[23] = grid_data[15];

        // vertex: u_grid_min
        highp[24] = grid_data[16];
        highp[25] = grid_data[17];
        highp[26] = grid_data[18];
        highp[27] = grid_data[19];

        // vertex: u_grid_max
        highp[28] = grid_data[20];
        highp[29] = grid_data[21];
        highp[30] = grid_data[22];
        highp[31] = grid_data[23];

        // vertex: u_offset
        highp[32] = grid_data[24];
        highp[33] = grid_data[25];

        index = 36;
    }

    let face: number = Math.sign(matrix[0] * matrix[4]);
    if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
        face = -Math.sign(matrix[1] * matrix[3]);
    }

    let halfWidth: number = $context.thickness * 0.5;
    let scaleX: number;
    let scaleY: number;
    if (grid_data) {
        scaleX = Math.abs(grid_data[6] + grid_data[8]);
        scaleY = Math.abs(grid_data[7] + grid_data[9]);
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

    // fragment: u_color
    const mediump = shader_manager.mediump;
    mediump[0] = $context.$strokeStyle[0];
    mediump[1] = $context.$strokeStyle[1];
    mediump[2] = $context.$strokeStyle[2];
    mediump[3] = $context.$strokeStyle[3];
};