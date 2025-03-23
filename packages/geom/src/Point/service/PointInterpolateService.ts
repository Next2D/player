import { Point } from "../../Point";

/**
 * @description 2点間の補間を返します。
 *              Returns the interpolation between two points.
 *
 * @param  {Point} point1
 * @param  {Point} point2
 * @param  {number} f
 * @return {Point}
 * @method
 * @public
 */
export const execute = (point1: Point, point2: Point, f: number): Point =>
{
    return new Point(
        point1.x + (point2.x - point1.x) * (1 - f),
        point1.y + (point2.y - point1.y) * (1 - f)
    );
};