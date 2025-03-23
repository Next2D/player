import type { Point } from "../../Point";
import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された量だけオフセットする。
 *              Offset the Rectangle by the given amount.
 *
 * @param  {Rectangle} rectangle
 * @param  {Point} point
 * @return {void}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle, point: Point): void =>
{
    rectangle.x += point.x;
    rectangle.y += point.y;
};