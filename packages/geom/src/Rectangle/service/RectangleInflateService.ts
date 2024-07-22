import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値を変更
 *              Change the value of the specified Rectangle
 *
 * @param  {Rectangle} src
 * @param  {number} dx
 * @param  {number} dy
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dx: number, dy: number): void =>
{
    src.x      -= dx;
    src.width  += 2 * dx;
    src.y      -= dy;
    src.height += 2 * dy;
};