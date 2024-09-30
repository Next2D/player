import type { ShaderManager } from "../../ShaderManager";
import {
    $gridEnabled,
    $gridData
} from "../../../Grid";
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
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager): void =>
{
    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    // vertex: u_viewport
    highp[3] = $getViewportWidth();
    highp[7] = $getViewportHeight();

    let index = 0;
    const isGridEnabled = $gridEnabled();
    if (!isGridEnabled) {
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
        highp[0]  = $gridData[0];
        highp[1]  = $gridData[1];
        highp[2]  = 0;

        highp[4]  = $gridData[2];
        highp[5]  = $gridData[3];
        highp[6]  = 0;

        highp[8]  = $gridData[4];
        highp[9]  = $gridData[5];
        highp[10] = 1;

        // vertex: u_ancestor_matrix
        highp[12] = $gridData[6];
        highp[13] = $gridData[7];
        highp[14] = 0;

        highp[16] = $gridData[8];
        highp[17] = $gridData[9];
        highp[18] = 0;

        highp[20] = $gridData[10];
        highp[21] = $gridData[11];
        highp[22] = 1;

        // vertex: u_parent_viewport
        highp[11] = $gridData[12];
        highp[15] = $gridData[13];
        highp[19] = $gridData[14];
        highp[23] = $gridData[15];

        // vertex: u_grid_min
        highp[24] = $gridData[16];
        highp[25] = $gridData[17];
        highp[26] = $gridData[18];
        highp[27] = $gridData[19];

        // vertex: u_grid_max
        highp[28] = $gridData[20];
        highp[29] = $gridData[21];
        highp[30] = $gridData[22];
        highp[31] = $gridData[23];

        // vertex: u_offset
        highp[32] = $gridData[24];
        highp[33] = $gridData[25];

        index = 36;
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

    // fragment: u_color
    const mediump = shader_manager.mediump;
    mediump[0] = $context.$strokeStyle[0];
    mediump[1] = $context.$strokeStyle[1];
    mediump[2] = $context.$strokeStyle[2];
    mediump[3] = $context.$strokeStyle[3];
};