import type { IPath } from "../../interface/IPath";

/**
 * @description 現在のパスに頂点情報を追加します。
 *              Add vertex information to the current path.
 * 
 * @param  {array} current_path
 * @param  {number} x
 * @param  {number} y
 * @param  {boolean} is_control_point
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    current_path: IPath, 
    x: number,
    y: number,
    is_control_point: boolean
): void => {
    current_path.push(x, y, is_control_point);
};