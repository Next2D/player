import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";
import { $currentPath } from "../PathCommandState";

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
 * @protected
 */
export const execute = (
    cx: number, cy: number,
    x: number ,y: number
): void => {

    if (!$currentPath.length) {
        pathCommandMoveToUseCase(0, 0);
    }

    if (pathCommandEqualsToLastPointService(x, y)) {
        return;
    }

    pathCommandPushPointToCurrentPathService(cx, cy, true);
    pathCommandPushPointToCurrentPathService(x, y, false);
};
