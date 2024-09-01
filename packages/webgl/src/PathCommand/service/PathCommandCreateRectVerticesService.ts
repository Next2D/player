import type { IPath } from "../../interface/IPath";
import { $getArray } from "../../WebGLUtil";

/**
 * @description 指定の座標とサイズで矩形を描画
 *              Draw a rectangle with the specified coordinates and size
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {number} w
 * @param  {number} h
 * @return {array}
 * @method
 * @public
 */
export const execute = (x: number, y: number, w: number, h: number): IPath[] =>
{
    return $getArray($getArray(
        x,     y,     false,
        x + w, y,     false,
        x + w, y + h, false,
        x,     y + h, false
    ));
};