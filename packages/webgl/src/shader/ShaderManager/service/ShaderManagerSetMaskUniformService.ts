import type { ShaderManager } from "../../ShaderManager";
import {
    $context,
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerのマスクのuniform変数を設定します。
 *              Set the mask uniform variables of the ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {boolean} has_grid
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager, has_grid: boolean): void =>
{
    // const highp  = shader_manager.highp;
    // const matrix = $context.$matrix;

    // if (!has_grid) {
    //     highp[0]  = matrix[0];
    //     highp[1]  = matrix[1];
    //     highp[2]  = matrix[2];

    //     highp[4]  = matrix[3];
    //     highp[5]  = matrix[4];
    //     highp[6]  = matrix[5];

    //     highp[8]  = matrix[6];
    //     highp[9]  = matrix[7];
    //     highp[10] = matrix[8];

    //     // vertex: u_viewport
    //     highp[3] = $getViewportWidth();
    //     highp[7] = $getViewportHeight();
    // } else {
    //     // todo
    // }
};