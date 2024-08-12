import type { IPath } from "./interface/IPath";
import { execute as pathCommandBeginPathService } from "./PathCommand/service/PathCommandBeginPathService";
import { execute as pathCommandMoveToUseCase } from "./PathCommand/usecase/PathCommandMoveToUseCase";
import { execute as pathCommandLineToUseCase } from "./PathCommand/usecase/PathCommandLineToUseCase";
import { execute as pathCommandQuadraticCurveToUseCase } from "./PathCommand/usecase/PathCommandQuadraticCurveToUseCase";
import { execute as pathCommandBezierCurveToUseCase } from "./PathCommand/usecase/PathCommandBezierCurveToUseCase";
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

/**
 * @description 直線を描画
 *              Draw a straight line
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const lineTo = (x: number, y: number): void =>
{
    pathCommandLineToUseCase($currentPath, $vertices, x, y);
};

/**
 * @description 二次曲線を描画
 *              Draw a quadratic curve
 *
 * @param  {number} cx
 * @param  {number} cy
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const quadraticCurveTo = (
    cx: number, cy: number,
    x: number ,y: number
): void => {
    pathCommandQuadraticCurveToUseCase($currentPath, $vertices, cx, cy, x, y);
};

/**
 * @description 三次曲線を描画
 *              Draw a cubic curve
 * 
 * @param  {number} cx1
 * @param  {number} cy1
 * @param  {number} cx2
 * @param  {number} cy2
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @public
 */
export const bezierCurveTo = (
    cx1: number, cy1: number,
    cx2: number, cy2: number,
    x: number, y: number
): void => {
    pathCommandBezierCurveToUseCase($currentPath, $vertices, cx1, cy1, cx2, cy2, x, y);
};