import type { IPath } from "../../interface/IPath";

/**
 * @description 現在操作中のパス配列を全てverticesに統合します
 *              Integrate all path arrays currently being operated into vertices
 * 
 * @param  {array} current_path
 * @param  {array} vertices
 * @return {void}
 * @method
 * @protected
 */
export const execute = (current_path: IPath, vertices: IPath[]): void =>
{
    if (current_path.length < 4) {
        current_path.length = 0;
        return ;
    }

    vertices.push(current_path.slice(0));
    current_path.length = 0;
};