import type { ShaderManager } from "../../ShaderManager";
import {
    $gridEnabled,
    $gridData
} from "../../../Grid";
import {
    $getViewportWidth,
    $getViewportHeight,
    $clamp,
    $context
} from "../../../WebGLUtil";

/**
 * @description 線のグラデーションのuniformを設定
 *              Set line gradient uniform
 *
 * @param  {ShaderManager} shader_manager
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
    points: Float32Array | null = null
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
    const isGridEnabled = $gridEnabled();
    if (isGridEnabled) {

        // vertex: u_parent_matrix
        highp[20]  = $gridData[0];
        highp[21]  = $gridData[1];
        highp[22]  = 0;

        highp[24]  = $gridData[2];
        highp[25]  = $gridData[3];
        highp[26]  = 0;

        highp[28]  = $gridData[4];
        highp[29]  = $gridData[5];
        highp[30] = 1;

        // vertex: u_ancestor_matrix
        highp[32] = $gridData[6];
        highp[33] = $gridData[7];
        highp[34] = 0;

        highp[36] = $gridData[8];
        highp[37] = $gridData[9];
        highp[38] = 0;

        highp[40] = $gridData[10];
        highp[41] = $gridData[11];
        highp[42] = 1;

        // vertex: u_parent_viewport
        highp[31] = $gridData[12];
        highp[35] = $gridData[13];
        highp[39] = $gridData[14];
        highp[43] = $gridData[15];

        // vertex: u_grid_min
        highp[44] = $gridData[16];
        highp[45] = $gridData[17];
        highp[46] = $gridData[18];
        highp[47] = $gridData[19];

        // vertex: u_grid_max
        highp[48] = $gridData[20];
        highp[49] = $gridData[21];
        highp[50] = $gridData[22];
        highp[51] = $gridData[23];

        // vertex: u_offset
        highp[52] = $gridData[24];
        highp[53] = $gridData[25];

        index += 56;
    }

    let face: number = Math.sign(matrix[0] * matrix[4]);
    if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
        face = -Math.sign(matrix[1] * matrix[3]);
    }

    let halfWidth: number = $context.thickness * 0.5;
    let scaleX: number;
    let scaleY: number;
    if (isGridEnabled) {
        scaleX = Math.abs($gridData[6] + $gridData[8]);
        scaleY = Math.abs($gridData[7] + $gridData[9]);
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

    index += 4;

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