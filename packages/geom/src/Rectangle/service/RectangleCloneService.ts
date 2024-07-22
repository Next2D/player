import { Rectangle } from "../../Rectangle";

/**
 * @description 指定のRectangleを複製を返却
 *              Returns a duplicate of the specified Rectangle
 *
 * @param  {Rectangle} src
 * @return {Rectangle}
 * @method
 * @public
 */
export const execute = (src: Rectangle): Rectangle =>
{
    return new Rectangle(src.x, src.y, src.width, src.height);
};