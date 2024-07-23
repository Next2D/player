import type { Point } from "../../Point";

/**
 * @description 指定されたポイントの座標を設定します。
 *              Sets the coordinates of the specified point.
 *
 * @param  {Point} point
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (point: Point, x: number, y: number): void =>
{
    point.x = x;
    point.y = y;
};