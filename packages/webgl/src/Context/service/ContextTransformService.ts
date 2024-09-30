import type { Context } from "../../Context";

/**
 * @description 2D変換行列の乗算を行います
 *              Multiply the 2D transformation matrix
 *
 * @param  {Context} context
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @param  {number} e
 * @param  {number} f
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    context: Context,
    a: number, b: number, c: number,
    d: number, e: number, f: number
): void => {

    const a00: number = context.$matrix[0];
    const a01: number = context.$matrix[1];
    const a10: number = context.$matrix[3];
    const a11: number = context.$matrix[4];
    const a20: number = context.$matrix[6];
    const a21: number = context.$matrix[7];

    context.$matrix[0] = a * a00 + b * a10;
    context.$matrix[1] = a * a01 + b * a11;
    context.$matrix[3] = c * a00 + d * a10;
    context.$matrix[4] = c * a01 + d * a11;
    context.$matrix[6] = e * a00 + f * a10 + a20;
    context.$matrix[7] = e * a01 + f * a11 + a21;
};