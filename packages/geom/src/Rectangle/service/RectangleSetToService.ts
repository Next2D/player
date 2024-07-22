import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された値に設定する
 *              Set the rectangle to the specified value
 *
 * @param  {Rectangle} src
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    src: Rectangle,
    x: number,
    y: number,
    width: number,
    height: number
): void => {
    src.x      = x;
    src.y      = y;
    src.width  = width;
    src.height = height;
};