import type { ITextureObject } from "../../../interface/ITextureObject";

/**
 * @description コンボリューション・フィルタを適用する
 *              Apply convolution filter
 *
 * @param  {ITextureObject} texture_object
 * @param  {number} matrix_x
 * @param  {number} matrix_y
 * @param  {Float32Array} matrix
 * @param  {number} divisor
 * @param  {number} bias
 * @param  {boolean} preserve_alpha
 * @param  {boolean} clamp
 * @param  {number} color
 * @param  {number} alpha
 * @return {ITextureObject}
 * @method
 * @protected
 */
export const execute = (
    texture_object: ITextureObject,
    matrix_x: number = 0,
    matrix_y: number = 0,
    matrix: Float32Array,
    divisor: number = 1,
    bias: number = 0,
    preserve_alpha: boolean = true,
    clamp: boolean = true,
    color: number = 0,
    alpha: number = 0
): ITextureObject => {

    console.log(
        "FilterApplyConvolutionFilterUseCase",
        matrix_x,
        matrix_y,
        matrix,
        divisor,
        bias,
        preserve_alpha,
        clamp,
        color,
        alpha
    );
    return texture_object;
};