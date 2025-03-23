import type { Matrix } from "../../Matrix";
import { Point } from "../../Point";

/**
 * @description Matrixを使ってPointを変換
 *              Transform Point using Matrix
 *
 * @param  {Matrix} matrix
 * @param  {Point} point
 * @return {Point}
 * @method
 * @public
 */
export const execute = (matrix: Matrix, point: Point): Point =>
{
    return new Point(
        point.x * matrix._$matrix[0] + point.y * matrix._$matrix[2],
        point.x * matrix._$matrix[1] + point.y * matrix._$matrix[3]
    );
};