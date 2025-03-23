import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleがRectangle内に含まれるかを判定
 *              Determines whether the specified Rectangle is within the Rectangle
 *
 * @param  {Rectangle} rectangle1
 * @param  {Rectangle} rectangle2
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle1: Rectangle, rectangle2: Rectangle): boolean =>
{
    return rectangle1.x <= rectangle2.x
        && rectangle1.y <= rectangle2.y
        && rectangle1.right >= rectangle2.right
        && rectangle1.bottom >= rectangle2.bottom;
};