import type { IPath } from "./interface/IPath";
import { execute as pathCommandPushCurrentPathToVerticesService } from "./PathCommand/service/PathCommandPushCurrentPathToVerticesService";
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
 * @return {array}
 * @method
 * @public
 */
export const getVertices = (): IPath[] => 
{
    pathCommandPushCurrentPathToVerticesService();
    return $vertices;
};