import type { IPath } from "../../interface/IPath";

/**
 * @description 最終の頂点情報と指定の(x,y)座標が一致するかどうかを判定します。
 *              Determines whether the last vertex information matches the specified (x, y) coordinates.
 * 
 * @param  {array} current_path
 * @param  {number} x
 * @param  {number} y
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (current_path: IPath,  x: number, y: number): boolean =>
{
    const length = current_path.length;
    const lastX: number = +current_path[length - 3];
    const lastY: number = +current_path[length - 2];
    return x === lastX && y === lastY;
};