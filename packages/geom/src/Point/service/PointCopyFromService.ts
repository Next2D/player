import type { Point } from "../../Point";

/**
 * @description 指定されたポイントの値をコピーします。
 *              Copies the value of the specified point.
 *
 * @param  {Point} src
 * @param  {Point} dst
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Point, dst: Point): void =>
{
    src.x = dst.x;
    src.y = dst.y;
};