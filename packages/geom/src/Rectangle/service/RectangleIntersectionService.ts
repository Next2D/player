import { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleの交差部分を取得
 *              Get the intersection of the specified Rectangle
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {Rectangle}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): Rectangle =>
{
    const sx = Math.max(src.x, dst.x);
    const sy = Math.max(src.y, dst.y);
    const ex = Math.min(src.right,  dst.right);
    const ey = Math.min(src.bottom, dst.bottom);

    const w = ex - sx;
    const h = ey - sy;
    return w > 0 && h > 0
        ? new Rectangle(sx, sy, w, h)
        : new Rectangle(0, 0, 0, 0);
};