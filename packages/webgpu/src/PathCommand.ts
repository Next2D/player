import type { IPath } from "./interface/IPath";
import { $getArray } from "./WebGPUUtil";

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
    // TODO: WebGPU版のパス→頂点配列変換実装
    // pathCommandPushCurrentPathToVerticesService(stroke);
    return $vertices;
};