import type { Point } from "../../Point";

/**
 * @description 2点が等しいかどうかを返します。
 *              Returns whether two points are equal.
 *
 * @param  {Point} point1
 * @param  {Point} point2
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (point1: Point, point2: Point): boolean =>
{
    return point1.x === point2.x && point1.y === point2.y;
};