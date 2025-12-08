import type { IPath } from "../interface/IPath";

/**
 * @description 配列を取得するヘルパー関数
 *              Helper function to get array
 *
 * @return {array}
 * @method
 * @private
 */
const $getArray = <T>(): T[] => {
    return [];
};

/**
 * @description 配列をプールに返却するヘルパー関数
 *              Helper function to return array to pool
 *
 * @param  {array} array
 * @return {void}
 * @method
 * @private
 */
export const $poolArray = <T>(array: T[] | undefined): void => {
    if (array) {
        array.length = 0;
    }
};

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
