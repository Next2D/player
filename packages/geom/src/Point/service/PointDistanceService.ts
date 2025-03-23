import type { Point } from "../../Point";

/**
 * @description 2点間の距離を返します。
 *              Returns the distance between two points.
 *
 * @param  {Point} point1
 * @param  {Point} point2
 * @return {number}
 * @method
 * @public
 */
export const execute = (point1: Point, point2: Point): number =>
{
    return Math.sqrt(
        Math.pow(point1.x - point2.x, 2)
        + Math.pow(point1.y - point2.y, 2)
    );
};