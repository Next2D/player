import type { Matrix } from "../../Matrix";

/**
 * @description マトリックスの設定変換
 *              Set transformation of matrix
 *
 * @param  {Matrix} matrix
 * @param  {number} a
 * @param  {number} b
 * @param  {number} c
 * @param  {number} d
 * @param  {number} tx
 * @param  {number} ty
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    matrix: Matrix,
    a: number, b: number,
    c: number, d: number,
    tx: number, ty: number
): void => {

    const array = matrix._$matrix;
    array[0] = a;
    array[1] = b;
    array[2] = c;
    array[3] = d;
    array[4] = tx;
    array[5] = ty;
};