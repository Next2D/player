import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleがRectangle内に含まれるかを判定
 *              Determines whether the specified Rectangle is within the Rectangle
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): boolean =>
{
    return src.x <= dst.x
        && src.y <= dst.y
        && src.right >= dst.right
        && src.bottom >= dst.bottom;
};