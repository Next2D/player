import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定の座標がRectangle内に含まれるかを判定
 *              Determines whether the specified coordinates are within the Rectangle
 *
 * @param  {Rectangle} rectangle
 * @param  {number} x
 * @param  {number} y
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle, x: number, y: number): boolean =>
{
    return rectangle.x <= x
        && rectangle.y <= y
        && rectangle.right > x
        && rectangle.bottom > y;
};