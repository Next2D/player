import type { IPath } from "./interface/IPath";
import { execute as pathCommandBeginPathService } from "./PathCommand/service/PathCommandBeginPathService";
import { execute as pathCommandMoveToUseCase } from "./PathCommand/usecase/PathCommandMoveToUseCase";
import { $getArray } from "./WebGLUtil";

/**
 * @description 現在操作中のパス配列
 *              Current path array being operated
 * 
 * @type {array}
 * @private
 */
const $currentPath: IPath = $getArray();

/**
 * @description 頂点配列
 *              Vertex array
 * 
 * @type {array}
 * @private
 */
const $vertices: IPath[] = $getArray();

/**
 * @description 描画を開始するタイミングで内部情報を初期化
 *              Initialize internal information when starting drawing
 * 
 * @return {void}
 * @method
 * @public
 */
export const beginPath = (): void =>
{
    pathCommandBeginPathService($currentPath, $vertices);
}

/**
 * @description 指定の(x,y)座標に移動
 *              Move to the specified (x, y) coordinates
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const moveTo = (x: number, y: number): void =>
{
    pathCommandMoveToUseCase($currentPath, $vertices, x, y);
}