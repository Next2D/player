import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を空にする
 *              Make the rectangle empty
 *
 * @param  {Rectangle} rectangle
 * @return {void}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle): void =>
{
    rectangle.x = rectangle.y = rectangle.width = rectangle.height = 0;
};