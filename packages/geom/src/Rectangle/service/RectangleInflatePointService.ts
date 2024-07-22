import type { Point } from "../../Point";
import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値を変更
 *              Change the value of the specified Rectangle
 *
 * @param  {Rectangle} src
 * @param  {Point} point
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle, point: Point): void =>
{
    src.x      -= point.x;
    src.width  += 2 * point.x;
    src.y      -= point.y;
    src.height += 2 * point.y;
};