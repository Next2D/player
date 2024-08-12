import type { IPath } from "../../interface/IPath";
import { $poolArray } from "../../WebGLUtil";

/**
 * @description 現在操作中のパス配列を全てクリアします。
 *              Clear all path arrays currently being operated.
 * 
 * @param  {array} current_path
 * @param  {array} vertices
 * @return {void}
 * @method
 * @protected
 */
export const execute = (current_path: IPath, vertices: IPath[]): void =>
{
    current_path.length = 0;

    while (vertices.length) {
        $poolArray(vertices.pop());
    }
};