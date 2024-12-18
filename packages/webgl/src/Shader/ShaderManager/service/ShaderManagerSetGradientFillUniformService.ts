import type { ShaderManager } from "../../ShaderManager";
import {
    $getViewportWidth,
    $getViewportHeight,
    $clamp
} from "../../../WebGLUtil";

/**
 * @description 塗りのグラデーションのuniformを設定
 *              Set fill gradient uniform
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} type
 * @param  {Float32Array} matrix
 * @param  {Float32Array} inverse_matrix
 * @param  {number} [focal_point_ratio=0]
 * @param  {Float32Array} [points=null]
 * @param  {Float32Array | null} [grid_data=null]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    shader_manager: ShaderManager,
    type: number,
    matrix: Float32Array,
    inverse_matrix: Float32Array,
    focal_point_ratio: number = 0,
    points: Float32Array | null = null,
    grid_data: Float32Array | null = null
): void => {

    const highp: Float32Array | Int32Array = shader_manager.highp;

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

    // vertex: u_inverse_matrix
    highp[12] = inverse_matrix[0];
    highp[13] = inverse_matrix[1];
    highp[14] = inverse_matrix[2];

    highp[16] = inverse_matrix[3];
    highp[17] = inverse_matrix[4];
    highp[18] = inverse_matrix[5];

    highp[11] = inverse_matrix[6];
    highp[15] = inverse_matrix[7];
    highp[19] = inverse_matrix[8];

    // vertex: u_viewport
    highp[3] = $getViewportWidth();
    highp[7] = $getViewportHeight();

    let index = 20;
    if (grid_data) {
        // vertex: u_parent_matrix
        highp[20]  = grid_data[0];
        highp[21]  = grid_data[1];
        highp[22]  = 0;

        highp[24]  = grid_data[2];
        highp[25]  = grid_data[3];
        highp[26]  = 0;

        highp[28]  = grid_data[4];
        highp[29]  = grid_data[5];
        highp[30] = 1;

        // vertex: u_ancestor_matrix
        highp[32] = grid_data[6];
        highp[33] = grid_data[7];
        highp[34] = 0;

        highp[36] = grid_data[8];
        highp[37] = grid_data[9];
        highp[38] = 0;

        highp[40] = grid_data[10];
        highp[41] = grid_data[11];
        highp[42] = 1;

        // vertex: u_parent_viewport
        highp[31] = grid_data[12];
        highp[35] = grid_data[13];
        highp[39] = grid_data[14];
        highp[43] = grid_data[15];

        // vertex: u_grid_min
        highp[44] = grid_data[16];
        highp[45] = grid_data[17];
        highp[46] = grid_data[18];
        highp[47] = grid_data[19];

        // vertex: u_grid_max
        highp[48] = grid_data[20];
        highp[49] = grid_data[21];
        highp[50] = grid_data[22];
        highp[51] = grid_data[23];

        // vertex: u_offset
        highp[52] = grid_data[24];
        highp[53] = grid_data[25];

        index = 56;
    }

    if (type === 0) {
        // fragment: u_linear_points
        highp[index++] = (points as Float32Array)[0];
        highp[index++] = (points as Float32Array)[1];
        highp[index++] = (points as Float32Array)[2];
        highp[index]   = (points as Float32Array)[3];
    } else {
        // fragment: u_radial_point
        highp[index++] = 819.2;
        // fragment: u_focal_point_ratio
        highp[index] = $clamp(focal_point_ratio, -0.975, 0.975, 0);
    }
};