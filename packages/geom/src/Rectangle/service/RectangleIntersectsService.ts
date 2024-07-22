import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangle同士が重なっているかどうかを判定
 *              Determine whether the specified Rectangles overlap
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): boolean =>
{
    const sx = Math.max(src.x, dst.x);
    const sy = Math.max(src.y, dst.y);
    const ex = Math.min(src.right,  dst.right);
    const ey = Math.min(src.bottom, dst.bottom);
    return ex - sx > 0 && ey - sy > 0;
};