import type { Point } from "../../Point";

/**
 * @description 2点が等しいかどうかを返します。
 *              Returns whether two points are equal.
 *
 * @param  {Point} src
 * @param  {Point} dst
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Point, dst: Point): boolean =>
{
    return src.x === dst.x && src.y === dst.y;
};