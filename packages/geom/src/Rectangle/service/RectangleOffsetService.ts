import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された量だけオフセットする。
 *              Offset the Rectangle by the given amount.
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
    src.x += dx;
    src.y += dy;
};