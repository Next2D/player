import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleが空かどうかを返す
 *              Returns whether the specified Rectangle is empty
 *
 * @param  {Rectangle} rectangle
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle): boolean =>
{
    return rectangle.width <= 0 || rectangle.height <= 0;
};