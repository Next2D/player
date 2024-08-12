import type { IPath } from "../../interface/IPath";
import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";

/**
 * @description 二次曲線を描画
 *              Draw a quadratic curve
 *
 * @param  {array} current_path 
 * @param  {array} vertices 
 * @param  {number} cx 
 * @param  {number} cy 
 * @param  {number} x 
 * @param  {number} y 
 * @return {void}
 * @method
 * @protected
 */
export const execute = (
    current_path: IPath, 
    vertices: IPath[],
    cx: number, cy: number,
    x: number ,y: number
): void => {

    if (!current_path.length) {
        pathCommandMoveToUseCase(current_path, vertices, 0, 0);
    }

    if (pathCommandEqualsToLastPointService(current_path, x, y)) {
        return;
    }

    pathCommandPushPointToCurrentPathService(current_path, cx, cy, true);
    pathCommandPushPointToCurrentPathService(current_path, x, y, false);
};