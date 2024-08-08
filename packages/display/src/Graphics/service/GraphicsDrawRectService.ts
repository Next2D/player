import type { Graphics } from "../../Graphics";

/**
 * @description 矩形を描画データを登録
 *              Register rectangle drawing data
 *             
 * @param  {Graphics} graphics
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @return {Graphics}
 * @method
 * @protected
 */
export const execute = (
    graphics: Graphics,
    x: number, y: number,
    width: number, height: number
): Graphics => {

    // valid
    x = +x || 0;
    y = +y || 0;

    width  = +width  || 0;
    height = +height || 0;

    const xMax = Math.round(x + width);
    const yMax = Math.round(y + height);

    return graphics
        .moveTo(x,    y)
        .lineTo(x,    yMax)
        .lineTo(xMax, yMax)
        .lineTo(xMax, y)
        .lineTo(x,    y);
};