import type { ShaderManager } from "../../ShaderManager";
import {
    $gl,
    $context
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerの塗りのuniform変数を設定します。
 *              Set the fill uniform variables of the ShaderManager.
 * 
 * @param  {ShaderManager} shader_manager 
 * @param  {boolean} has_grid 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager, has_grid: boolean): void =>
{
    const highp  = shader_manager.highp;
    const matrix = $context.$matrix;

    if (!has_grid) {
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
        const viewport = $gl.getParameter($gl.VIEWPORT);
        highp[3] = viewport[2];
        highp[7] = viewport[3];
    } else {
        // todo
    }

    const mediump = shader_manager.mediump;

    const fillStyle = $context.$fillStyle
    // fragment: u_color
    mediump[0] = fillStyle[0];
    mediump[1] = fillStyle[1];
    mediump[2] = fillStyle[2];
    mediump[3] = fillStyle[3] * $context.globalAlpha;
};