import type { Context } from "../../Context";

/**
 * @description 2D変換行列を設定します
 *              Set the 2D transformation matrix
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
    context.$matrix[0] = a;
    context.$matrix[1] = b;
    context.$matrix[3] = c;
    context.$matrix[4] = d;
    context.$matrix[6] = e;
    context.$matrix[7] = f;
};