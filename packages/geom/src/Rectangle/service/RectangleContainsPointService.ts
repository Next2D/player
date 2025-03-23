import type { Rectangle } from "../../Rectangle";
import type { Point } from "../../Point";

/**
 * @description 指定の座標がRectangle内に含まれるかを判定
 *              Determines whether the specified coordinates are within the Rectangle
 *
 * @param  {Rectangle} rectangle
 * @param  {Point} point
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle, point: Point): boolean =>
{
    return rectangle.x <= point.x
        && rectangle.y <= point.y
        && rectangle.right > point.x
        && rectangle.bottom > point.y;
};