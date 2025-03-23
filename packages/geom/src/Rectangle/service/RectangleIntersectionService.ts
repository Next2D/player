import { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの交差部分を取得
 *              Get the intersection of the specified Rectangle
 *
 * @param  {Rectangle} rectangle1
 * @param  {Rectangle} rectangle2
 * @return {Rectangle}
 * @method
 * @public
 */
export const execute = (rectangle1: Rectangle, rectangle2: Rectangle): Rectangle =>
{
    const sx = Math.max(rectangle1.x, rectangle2.x);
    const sy = Math.max(rectangle1.y, rectangle2.y);
    const ex = Math.min(rectangle1.right,  rectangle2.right);
    const ey = Math.min(rectangle1.bottom, rectangle2.bottom);

    const w = ex - sx;
    const h = ey - sy;
    return w > 0 && h > 0
        ? new Rectangle(sx, sy, w, h)
        : new Rectangle(0, 0, 0, 0);
};