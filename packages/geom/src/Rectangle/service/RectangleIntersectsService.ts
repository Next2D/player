import type { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangle同士が重なっているかどうかを判定
 *              Determine whether the specified Rectangles overlap
 *
 * @param  {Rectangle} rectangle1
 * @param  {Rectangle} rectangle2
 * @return {boolean}
 * @method
 * @public
 */
export const execute = (rectangle1: Rectangle, rectangle2: Rectangle): boolean =>
{
    const sx = Math.max(rectangle1.x, rectangle2.x);
    const sy = Math.max(rectangle1.y, rectangle2.y);
    const ex = Math.min(rectangle1.right,  rectangle2.right);
    const ey = Math.min(rectangle1.bottom, rectangle2.bottom);
    return ex - sx > 0 && ey - sy > 0;
};