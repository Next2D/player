import type { ShaderManager } from "../../ShaderManager";

/**
 * @description カラーマトリックスフィルターのUniformを設定します。
 *              Set the Uniform of the color matrix filter.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {number} width
 * @param  {number} height
 * @param  {Float32Array} matrix
 * @param  {number} divisor
 * @param  {number} bias
 * @param  {boolean} clamp
 * @param  {number} color_r
 * @param  {number} color_g
 * @param  {number} color_b
 * @param  {number} color_a
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    width: number,
    height: number,
    matrix: Float32Array,
    divisor: number,
    bias: number,
    clamp: boolean,
    color_r: number,
    color_g: number,
    color_b: number,
    color_a: number
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_rcp_size
    mediump[0] = 1 / width;
    mediump[1] = 1 / height;

    // fragment: u_rcp_divisor
    mediump[2] = 1 / divisor;

    // fragment: u_bias
    mediump[3] = bias / 255;

    let i = 4;
    if (!clamp) {
        // fragment: u_substitute_color
        mediump[i++] = color_r;
        mediump[i++] = color_g;
        mediump[i++] = color_b;
        mediump[i++] = color_a;
    }

    // fragment: u_matrix
    const length = matrix.length;
    for (let j = 0; j < length; j++) {
        mediump[i++] = matrix[j];
    }
};