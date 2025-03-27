import type { Graphics } from "../../Graphics";

/**
 * @description 角丸矩形を描画データを登録
 *              Register rounded rectangle drawing data
 *
 * @param  {Graphics} graphics
 * @param  {number} x
 * @param  {number} y
 * @param  {number} width
 * @param  {number} height
 * @param  {number} ellipse_width
 * @param  {number} [ellipse_height=NaN]
 * @return {Graphics}
 * @method
 * @protected
 */
export const execute = (
    graphics: Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    ellipse_width: number,
    ellipse_height: number = NaN
): Graphics => {

    x = +x || 0;
    y = +y || 0;

    width  = +width  || 0;
    height = +height || 0;

    ellipse_width  = +ellipse_width  || 0;
    ellipse_height = +ellipse_height || ellipse_width;

    width  = Math.round(width);
    height = Math.round(height);
    ellipse_width  = Math.round(ellipse_width);
    ellipse_height = Math.round(ellipse_height);

    const hew = ellipse_width  / 2;
    const heh = ellipse_height / 2;
    const c   = 4 / 3 * (Math.SQRT2 - 1);
    const cw  = c * hew;
    const ch  = c * heh;

    const dx0 = x   + hew;
    const dx1 = x   + width;
    const dx2 = dx1 - hew;

    const dy0 = y   + heh;
    const dy1 = y   + height;
    const dy2 = dy1 - heh;

    return graphics
        .moveTo(dx0, y)
        .lineTo(dx2, y)
        .cubicCurveTo(dx2 + cw, y, dx1, dy0 - ch, dx1, dy0)
        .lineTo(dx1, dy2)
        .cubicCurveTo(dx1, dy2 + ch, dx2 + cw, dy1, dx2, dy1)
        .lineTo(dx0, dy1)
        .cubicCurveTo(dx0 - cw, dy1, x, dy2 + ch, x, dy2)
        .lineTo(x, dy0)
        .cubicCurveTo(x, dy0 - ch, dx0 - cw, y, dx0, y);
};