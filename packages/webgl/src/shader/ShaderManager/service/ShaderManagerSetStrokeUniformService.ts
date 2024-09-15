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
 * @param  {boolean} has_grid
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    has_grid: boolean
): void => {
    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    let index = 0;
    if (!has_grid) {
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

        // vertex: u_viewport
        highp[3] = $getViewportWidth();
        highp[7] = $getViewportHeight();

        index = 12;
    } else {
        index = 32;
    }

    let face: number = Math.sign(matrix[0] * matrix[4]);
    if (face > 0 && matrix[1] !== 0 && matrix[3] !== 0) {
        face = -Math.sign(matrix[1] * matrix[3]);
    }

    let halfWidth: number = $context.thickness * 0.5;
    let scaleX: number;
    let scaleY: number;
    if (has_grid) {
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

    // fragment: u_color
    const mediump = shader_manager.mediump;
    mediump[0] = $context.$strokeStyle[0];
    mediump[1] = $context.$strokeStyle[1];
    mediump[2] = $context.$strokeStyle[2];
    mediump[3] = $context.$strokeStyle[3];
};