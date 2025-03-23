import { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleを複製を返却
 *              Returns a duplicate of the specified Rectangle
 *
 * @param  {Rectangle} rectangle
 * @return {Rectangle}
 * @method
 * @public
 */
export const execute = (rectangle: Rectangle): Rectangle =>
{
    return new Rectangle(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
};