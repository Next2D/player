import type { Point } from "../../Point";
import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された量だけオフセットする。
 *              Offset the Rectangle by the given amount.
 *
 * @param  {Rectangle} src
 * @param  {Point} point
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle, point: Point): void =>
{
    src.x += point.x;
    src.y += point.y;
};