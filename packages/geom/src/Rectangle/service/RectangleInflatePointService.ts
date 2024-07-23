import type { Point } from "../../Point";
import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値を変更
 *              Change the value of the specified Rectangle
 *
 * @param  {Rectangle} rectangle
 * @param  {Point} point
 * @return {void}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle, point: Point): void =>
{
    rectangle.x      -= point.x;
    rectangle.width  += 2 * point.x;
    rectangle.y      -= point.y;
    rectangle.height += 2 * point.y;
};