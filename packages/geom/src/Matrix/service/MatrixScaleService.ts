import type { Matrix } from "../../Matrix";

/**
 * @description マトリックスの拡大変換
 *              Scale transformation of matrix
 *
 * @param  {Matrix} matrix
 * @param  {number} scale_x
 * @param  {number} scale_y
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix, scale_x: number, scale_y: number): void =>
{
    const array = matrix._$matrix;

    array[0] *= scale_x;
    array[2] *= scale_x;
    array[4] *= scale_x;

    array[1] *= scale_y;
    array[3] *= scale_y;
    array[5] *= scale_y;
};