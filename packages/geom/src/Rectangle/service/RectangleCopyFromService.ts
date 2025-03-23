import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値をコピー
 *              Copy the value of the specified Rectangle
 *
 * @param  {Rectangle} dst
 * @param  {Rectangle} src
 * @return {void}
 * @method
 * @public
 */
export const execute = (dst: Rectangle, src: Rectangle): void =>
{
    dst.x      = src.x;
    dst.y      = src.y;
    dst.width  = src.width;
    dst.height = src.height;
};