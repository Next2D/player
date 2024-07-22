import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの値をコピー
 *              Copy the value of the specified Rectangle
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): void =>
{
    src.x      = dst.x;
    src.y      = dst.y;
    src.width  = dst.width;
    src.height = dst.height;
};