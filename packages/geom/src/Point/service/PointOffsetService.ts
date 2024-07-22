import type { Point } from "../../Point";

/**
 * @description 2点間の補間を返します。
 *              Returns the interpolation between two points.
 *
 * @param  {Point} src
 * @param  {number} dx
 * @param  {number} dy
 * @return {Point}
 * @method
 * @public
 */
export const execute = (src: Point, dx: number, dy: number): void =>
{
    src.x += dx;
    src.y += dy;
};