import { Point } from "../../Point";

/**
 * @description 2つの座標を加算します。
 *              Adds two points.
 *
 * @param  {Point} src
 * @param  {Point} dst
 * @return {Point}
 * @method
 * @public
 */
export const execute = (src: Point, dst: Point): Point =>
{
    return new Point(src.x + dst.x, src.y + dst.y);
};