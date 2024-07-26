import { Point } from "../../Point";

/**
 * @description 2つの座標を加算します。
 *              Adds two points.
 *
 * @param  {Point} point1
 * @param  {Point} point2
 * @return {Point}
 * @method
 * @public
 */
export const execute = (point1: Point, point2: Point): Point =>
{
    return new Point(point1.x + point2.x, point1.y + point2.y);
};