import type { ShaderManager } from "../../ShaderManager";

/**
 * @description カラーマトリックスフィルターのUniformを設定します。
 *              Set the Uniform of the color matrix filter.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {Float32Array} matrix
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    matrix: Float32Array
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_mul
    mediump[0]  = matrix[0];
    mediump[1]  = matrix[1];
    mediump[2]  = matrix[2];
    mediump[3]  = matrix[3];

    mediump[4]  = matrix[5];
    mediump[5]  = matrix[6];
    mediump[6]  = matrix[7];
    mediump[7]  = matrix[8];

    mediump[8]  = matrix[10];
    mediump[9]  = matrix[11];
    mediump[10] = matrix[12];
    mediump[11] = matrix[13];

    mediump[12] = matrix[15];
    mediump[13] = matrix[16];
    mediump[14] = matrix[17];
    mediump[15] = matrix[18];

    // fragment: u_add
    mediump[16] = matrix[4]  / 255;
    mediump[17] = matrix[9]  / 255;
    mediump[18] = matrix[14] / 255;
    mediump[19] = matrix[19] / 255;
};