import type { Graphics } from "../../Graphics";

/**
 * @description 楕円を描画データを登録
 *              Register ellipse drawing data
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

    x = +x || 0;
    y = +y || 0;
    width  = +width  || 0;
    height = +height || 0;

    width  = Math.round(width);
    height = Math.round(height);

    const hw = width  / 2; // half width
    const hh = height / 2; // half height
    const x0 = x + hw;
    const y0 = y + hh;
    const x1 = x + width;
    const y1 = y + height;
    const c  = 4 / 3 * (Math.SQRT2 - 1);
    const cw = c * hw;
    const ch = c * hh;

    return graphics
        .moveTo(x0, y)
        .cubicCurveTo(x0 + cw, y,       x1,      y0 - ch, x1, y0)
        .cubicCurveTo(x1,      y0 + ch, x0 + cw, y1,      x0, y1)
        .cubicCurveTo(x0 - cw, y1,      x,       y0 + ch, x,  y0)
        .cubicCurveTo(x,       y0 - ch, x0 - cw, y,       x0, y );
};