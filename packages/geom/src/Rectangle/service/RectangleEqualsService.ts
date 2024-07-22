import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleが等しいかを判定
 *              Determines whether the specified Rectangle is equal
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): boolean =>
{
    return src.x === dst.x
        && src.y === dst.y
        && src.width === dst.width
        && src.height === dst.height;
};