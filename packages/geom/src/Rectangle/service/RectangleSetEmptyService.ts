import type { Rectangle } from "../../Rectangle";

/**
 * @description 矩形を空にする
 *              Make the rectangle empty
 *
 * @param  {Rectangle} src
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle): void =>
{
    src.x = src.y = src.width = src.height = 0;
};