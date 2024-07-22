import type { Point } from "../../Point";

/**
 * @description 指定されたポイントの座標を設定します。
 *              Sets the coordinates of the specified point.
 *
 * @param  {Point} src
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Point, x: number, y: number): void =>
{
    src.x = x;
    src.y = y;
};