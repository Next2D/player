import type { Matrix } from "../../Matrix";

/**
 * @description マトリックスの座標移動
 *              Coordinate movement of matrix
 *
 * @param  {Matrix} matrix
 * @param  {number} dx
 * @param  {number} dy
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix, dx: number, dy: number): void =>
{
    matrix.tx += dx;
    matrix.ty += dy;
};