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
export const execute = (rectangle1: Rectangle, rectangle2: Rectangle): Rectangle =>
{
    if (rectangle1.isEmpty()) {
        return rectangle2.clone();
    }

    if (rectangle2.isEmpty()) {
        return rectangle1.clone();
    }

    return new Rectangle(
        Math.min(rectangle1.x, rectangle2.x),
        Math.min(rectangle1.y, rectangle2.y),
        Math.max(rectangle1.right - rectangle2.left, rectangle2.right - rectangle1.left),
        Math.max(rectangle1.bottom - rectangle2.top, rectangle2.bottom - rectangle1.top)
    );
};