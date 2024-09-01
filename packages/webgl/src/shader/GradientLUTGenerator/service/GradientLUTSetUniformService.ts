import { ShaderManager } from "../../ShaderManager";

/**
 * @description グラデーションLUTのuniform変数を設定します。
 *              Set the uniform variables of the gradient LUT.
 * 
 * @param {ShaderManager} shader_manager 
 * @param {array} stops 
 * @param {number} begin 
 * @param {number} end 
 * @param {Float32Array} table 
 */
export const execute = (
    shader_manager: ShaderManager,
    stops: number[],
    begin: number,
    end: number,
    table: Float32Array
): void => {

    const mediump: Int32Array | Float32Array = shader_manager.mediump;

    let index = 0;

    // fragment: u_gradient_color
    for (let idx = begin; idx < end; ++idx) {

        const position = idx * 5;

        mediump[index++] = 1;//table[stops[position + 1]];
        mediump[index++] = 0;//table[stops[position + 2]];
        mediump[index++] = 0;//table[stops[position + 3]];
        mediump[index++] = 1;//table[stops[position + 4]];
    }

    // fragment: u_gradient_t
    for (let idx = begin; idx < end; ++idx) {
        mediump[index++] = stops[idx * 5];
    }
};