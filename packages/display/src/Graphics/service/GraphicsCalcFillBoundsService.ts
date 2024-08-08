import type { Graphics } from "../../Graphics";

/**
 * @description 塗りの描画範囲を計算
 *              Calculate the fill drawing range
 * 
 * @param  {Graphics} graphics
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (graphics: Graphics, x: number = 0, y: number = 0): void =>
{
    graphics.xMin = Math.min(graphics.xMin, x);
    graphics.xMax = Math.max(graphics.xMax, x);
    graphics.yMin = Math.min(graphics.yMin, y);
    graphics.yMax = Math.max(graphics.yMax, y);
};