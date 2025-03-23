import { $currentPath } from "../../PathCommand";

/**
 * @description 最終の頂点情報と指定の(x,y)座標が一致するかどうかを判定します。
 *              Determines whether the last vertex information matches the specified (x, y) coordinates.
 *
 * @param  {number} x
 * @param  {number} y
 * @return {boolean}
 * @method
 * @protected
 */
export const execute = (x: number, y: number): boolean =>
{
    const length = $currentPath.length;
    const lastX: number = +$currentPath[length - 3];
    const lastY: number = +$currentPath[length - 2];
    return x === lastX && y === lastY;
};