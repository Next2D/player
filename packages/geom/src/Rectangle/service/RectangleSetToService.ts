import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を指定された値に設定する
 *              Set the rectangle to the specified value
 *
 * @param  {Rectangle} rectangle
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {void}
 * @method
 * @public
 */
export const execute = (
    rectangle: Rectangle,
    x: number,
    y: number,
    width: number,
    height: number
): void => {
    rectangle.x      = x;
    rectangle.y      = y;
    rectangle.width  = width;
    rectangle.height = height;
};