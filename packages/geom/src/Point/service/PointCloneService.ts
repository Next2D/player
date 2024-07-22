import { Point } from "../../Point";

/**
 * @description 座標を複製します。
 *              Duplicates the coordinates.
 *
 * @param  {Point} src
 * @return {Point}
 * @method
 * @public
 */
export const execute = (src: Point): Point =>
{
    return new Point(src.x, src.y);
};