import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された量だけオフセットする。
 *              Offset the Rectangle by the given amount.
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
    rectangle.x += dx;
    rectangle.y += dy;
};