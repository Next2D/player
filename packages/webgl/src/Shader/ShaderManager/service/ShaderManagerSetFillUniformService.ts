import type { ShaderManager } from "../../ShaderManager";
import {
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerの塗りのuniform変数を設定します。
 *              Set the fill uniform variables of the ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {Float32Array} grid_data
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    grid_data: Float32Array
): void => {

    const highp = shader_manager.highp;

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

    // vertex: u_viewport
    highp[3]  = $getViewportWidth();
    highp[7]  = $getViewportHeight();

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
};