import { Point } from "../../Point";

/**
 * @description 指定の座標を減算して、新しいポイントを作成
 *              Subtracts the specified coordinates to create a new point.
 *
 * @param  {Point} point1
 * @param  {Point} point2
 * @return {Point}
 * @method
 * @public
 */
export const execute = (point1: Point, point2: Point): Point =>
{
    return new Point(point1.x - point2.x, point1.y - point2.y);
};