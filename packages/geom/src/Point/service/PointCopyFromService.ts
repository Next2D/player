import type { Point } from "../../Point";

/**
 * @description 指定されたポイントの値をコピーします。
 *              Copies the value of the specified point.
 *
 * @param  {Point} dst
 * @param  {Point} src
 * @return {void}
 * @method
 * @public
 */
export const execute = (dst: Point, src: Point): void =>
{
    dst.x = src.x;
    dst.y = src.y;
};