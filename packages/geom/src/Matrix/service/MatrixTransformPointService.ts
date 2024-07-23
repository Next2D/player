import type { Matrix } from "../../Matrix";
import { Point } from "../../Point";

/**
 * @description マトリックスの座標変換
 *              Coordinate transformation of matrix
 *
 * @param  {Matrix} matrix
 * @param  {Point} point
 * @return {void}
 * @method
 * @public
 */
export const execute = (matrix: Matrix, point: Point): Point =>
{
    const x = point.x;
    const y = point.y;
    const array = matrix._$matrix;
    return new Point(
        x * array[0] + y * array[2] + array[4],
        x * array[1] + y * array[3] + array[5]
    );
};