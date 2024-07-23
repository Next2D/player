import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleが等しいかを判定
 *              Determines whether the specified Rectangle is equal
 *
 * @param  {Rectangle} rectangle1
 * @param  {Rectangle} dst
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle1: Rectangle, rectangle2: Rectangle): boolean =>
{
    return rectangle1.x === rectangle2.x
        && rectangle1.y === rectangle2.y
        && rectangle1.width === rectangle2.width
        && rectangle1.height === rectangle2.height;
};