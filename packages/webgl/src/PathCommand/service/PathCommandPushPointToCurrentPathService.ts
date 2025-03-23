import { $currentPath } from "../../PathCommand";

/**
 * @description 現在のパスに頂点情報を追加します。
 *              Add vertex information to the current path.
 *
 * @param  {number} x
 * @param  {number} y
 * @param  {boolean} is_control_point
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number, is_control_point: boolean): void =>
{
    $currentPath.push(x, y, is_control_point);
};