import { Rectangle } from "../../Rectangle";

/**
 * @description 2つの矩形を結合した矩形を返す
 *              Returns a rectangle that is the union of two rectangles
 *
 * @param  {Rectangle} src
 * @param  {Rectangle} dst
 * @return {void}
 * @method
 * @public
 */
export const execute = (src: Rectangle, dst: Rectangle): Rectangle =>
{
    if (src.isEmpty()) {
        return dst.clone();
    }

    if (dst.isEmpty()) {
        return src.clone();
    }

    return new Rectangle(
        Math.min(src.x, dst.x),
        Math.min(src.y, dst.y),
        Math.max(src.right - dst.left, dst.right - src.left),
        Math.max(src.bottom - dst.top, dst.bottom - src.top)
    );
};