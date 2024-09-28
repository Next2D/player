import type { ShaderManager } from "../../ShaderManager";
import { $gridEnabled, $gridData } from "../../../Grid";
import {
    $getViewportWidth,
    $getViewportHeight
} from "../../../WebGLUtil";

/**
 * @description ShaderManagerのマスクのuniform変数を設定します。
 *              Set the mask uniform variables of the ShaderManager.
 *
 * @param  {ShaderManager} shader_manager
 * @return {void}
 * @method
 * @protected
 */
export const execute = (shader_manager: ShaderManager): void =>
{
    if (!$gridEnabled()) {
        return ;
    }

    const highp = shader_manager.highp;
    
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

    // vertex: u_viewport
    highp[3]  = $getViewportWidth();
    highp[7]  = $getViewportHeight();

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
};