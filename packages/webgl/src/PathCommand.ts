import type { IPath } from "./interface/IPath";
import { $getArray } from "./WebGLUtil";

/**
 * @description 現在操作中のパス配列
 *              Current path array being operated
 *
 * @type {array}
 * @protected
 */
export const $currentPath: IPath = $getArray();

/**
 * @description 頂点配列
 *              Vertex array
 *
 * @type {array}
 * @protected
 */
export const $vertices: IPath[] = $getArray();

/**
 * @description 頂点配列を取得
 *              Get the vertex array
 *
 * @param  {boolean} [stroke=false]
 * @return {array}
 * @method
 * @public
 */
export const $getVertices = (stroke: boolean = false): IPath[] =>
{
    const minVertices = stroke ? 4 : 10;
    if ($currentPath.length < minVertices) {
        $currentPath.length = 0;
    }

    if ($currentPath.length) {
        $vertices.push($currentPath.slice(0));
        $currentPath.length = 0;
    }

    return $vertices;
};