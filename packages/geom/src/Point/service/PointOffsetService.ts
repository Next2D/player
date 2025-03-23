import type { Point } from "../../Point";

/**
 * @description 2点間の補間を返します。
 *              Returns the interpolation between two points.
 *
 * @param  {Point} point
 * @param  {number} dx
 * @param  {number} dy
 * @return {Point}
 * @method
 * @public
 */
export const execute = (point: Point, dx: number, dy: number): void =>
{
    point.x += dx;
    point.y += dy;
};