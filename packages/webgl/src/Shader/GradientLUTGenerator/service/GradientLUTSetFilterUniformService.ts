import type { ShaderManager } from "../../ShaderManager";
import { $GRADIENT_LUT_SHARED_STOPS } from "../../GradientLUTGenerator";

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

    // 共用のシェーダー (共用のストップ数用。u_mediump の要素数で見分ける) に、それより少ない
    // ストップを渡すときは、足りない分を最後のストップ (同じ色・同じ位置) で埋める。
    const count    = end - begin;
    const capacity = count < $GRADIENT_LUT_SHARED_STOPS
        && mediump.length === Math.ceil($GRADIENT_LUT_SHARED_STOPS * 5 / 4) * 4
        ? $GRADIENT_LUT_SHARED_STOPS
        : count;

    // fragment: u_gradient_color
    let i = 0;
    for (let j = begin; j < end; j++) {

        const color = colors[j];

        mediump[i++] = (color  >>  16)        / 255;
        mediump[i++] = (color  >>   8 & 0xff) / 255;
        mediump[i++] = (color         & 0xff) / 255;
        mediump[i++] = alphas[j];
    }

    for (let j = count; j < capacity; j++) {
        mediump[i++] = mediump[count * 4 - 4];
        mediump[i++] = mediump[count * 4 - 3];
        mediump[i++] = mediump[count * 4 - 2];
        mediump[i++] = mediump[count * 4 - 1];
    }

    // fragment: u_gradient_t
    for (let j = begin; j < end; j++) {
        mediump[i++] = ratios[j] / 255;
    }
    for (let j = count; j < capacity; j++) {
        mediump[i++] = ratios[end - 1] / 255;
    }
};