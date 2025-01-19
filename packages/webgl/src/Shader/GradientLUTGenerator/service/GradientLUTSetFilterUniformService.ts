import type { ShaderManager } from "../../ShaderManager";

/**
 * @description グラデーションフィルターのLUTのuniform変数を設定します。
 *              Set the uniform variables of the gradient filter LUT.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {Float32Array} ratios
 * @param  {Float32Array} colors
 * @param  {Float32Array}alphas
 * @param  {number} begin
 * @param  {number} end
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    ratios: Float32Array,
    colors: Float32Array,
    alphas: Float32Array,
    begin: number,
    end: number
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // fragment: u_gradient_color
    let i = 0;
    for (let j = begin; j < end; j++) {

        const color = colors[j];

        mediump[i++] = (color  >>  16)        / 255;
        mediump[i++] = (color  >>   8 & 0xff) / 255;
        mediump[i++] = (color         & 0xff) / 255;
        mediump[i++] = alphas[j];
    }

    // fragment: u_gradient_t
    for (let j = begin; j < end; j++) {
        mediump[i++] = ratios[j] / 255;
    }
};