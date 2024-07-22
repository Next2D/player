import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleが空かどうかを返す
 *              Returns whether the specified Rectangle is empty
 *
 * @param  {Rectangle} src
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle): boolean =>
{
    return src.width <= 0 || src.height <= 0;
};