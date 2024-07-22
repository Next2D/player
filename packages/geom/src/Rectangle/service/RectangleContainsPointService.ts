import type { Rectangle } from "../../Rectangle";
import type { Point } from "../../Point";

/**
 * @description 指定の座標がRectangle内に含まれるかを判定
 *              Determines whether the specified coordinates are within the Rectangle
 *
 * @param  {Rectangle} src
 * @param  {Point} point
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle, point: Point): boolean =>
{
    return src.x <= point.x
        && src.y <= point.y
        && src.right > point.x
        && src.bottom > point.y;
};