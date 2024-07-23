import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値を変更
 *              Change the value of the specified Rectangle
 *
 * @param  {Rectangle} rectangle
 * @param  {number} dx
 * @param  {number} dy
 * @return {void}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle, dx: number, dy: number): void =>
{
    rectangle.x      -= dx;
    rectangle.width  += 2 * dx;
    rectangle.y      -= dy;
    rectangle.height += 2 * dy;
};