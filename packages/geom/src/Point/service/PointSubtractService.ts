import { Point } from "../../Point";

/**
 * @description 指定の座標を減算して、新しいポイントを作成
 *              Subtracts the specified coordinates to create a new point.
 *
 * @param  {Point} src
 * @param  {Point} dst
 * @return {Point}
 * @method
 * @public
 */
export const execute = (src: Point, dst: Point): Point =>
{
    return new Point(src.x - dst.x, src.y - dst.y);
};