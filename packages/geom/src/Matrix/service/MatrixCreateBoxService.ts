import type { Matrix } from "../../Matrix";

/**
 * @description
 *
 * @param  {Matrix} matrix
 * @param  {number} scale_x
 * @param  {number} scale_y
 * @param  {number} rotation
 * @param  {number} [tx=0]
 * @param  {number} [ty=0]
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    matrix: Matrix,
    scale_x: number, scale_y: number,
    rotation: number = 0,
    tx: number = 0, ty: number = 0
): void =>
{
    matrix.identity();
    matrix.rotate(rotation);
    matrix.scale(scale_x, scale_y);
    matrix.translate(tx, ty);
};