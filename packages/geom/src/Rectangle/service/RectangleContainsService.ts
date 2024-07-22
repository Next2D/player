import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定の座標がRectangle内に含まれるかを判定
 *              Determines whether the specified coordinates are within the Rectangle
 *
 * @param  {Rectangle} src
 * @param  {number} x
 * @param  {number} y
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle, x: number, y: number): boolean =>
{
    return src.x <= x && src.y <= y && src.right > x && src.bottom > y;
};