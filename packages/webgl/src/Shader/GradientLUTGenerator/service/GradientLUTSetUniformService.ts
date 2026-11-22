import { ShaderManager } from "../../ShaderManager";
import { $GRADIENT_LUT_SHARED_STOPS } from "../../GradientLUTGenerator";

/**
 * @description グラデーションLUTのuniform変数を設定します。
 *              Set the uniform variables of the gradient LUT.
 *
 * @param  {ShaderManager} shader_manager
 * @param  {array} stops
 * @param  {number} begin
 * @param  {number} end
 * @param  {Float32Array} table
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    shader_manager: ShaderManager,
    stops: number[],
    begin: number,
    end: number,
    table: Float32Array
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    // 共用のシェーダー (共用のストップ数用。u_mediump の要素数で見分ける) に、それより少ない
    // ストップを渡すときは、足りない分を最後のストップ (同じ色・同じ位置) で埋める。
    const count    = end - begin;
    const capacity = count < $GRADIENT_LUT_SHARED_STOPS
        && mediump.length === Math.ceil($GRADIENT_LUT_SHARED_STOPS * 5 / 4) * 4
        ? $GRADIENT_LUT_SHARED_STOPS
        : count;

    let index = 0;

    // fragment: u_gradient_color
    for (let idx = begin; idx < end; ++idx) {

        const position = idx * 5;

        mediump[index++] = table[stops[position + 1]];
        mediump[index++] = table[stops[position + 2]];
        mediump[index++] = table[stops[position + 3]];
        mediump[index++] = table[stops[position + 4]];
    }

    for (let idx = count; idx < capacity; ++idx) {
        mediump[index++] = mediump[count * 4 - 4];
        mediump[index++] = mediump[count * 4 - 3];
        mediump[index++] = mediump[count * 4 - 2];
        mediump[index++] = mediump[count * 4 - 1];
    }

    // fragment: u_gradient_t
    for (let idx = begin; idx < end; ++idx) {
        mediump[index++] = stops[idx * 5];
    }
    for (let idx = count; idx < capacity; ++idx) {
        mediump[index++] = stops[(end - 1) * 5];
    }
};