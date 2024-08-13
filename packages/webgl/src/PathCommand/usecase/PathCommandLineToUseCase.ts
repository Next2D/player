import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandMoveToUseCase } from "./PathCommandMoveToUseCase";
import { $currentPath } from "../../PathCommand";

/**
 * @description 現在の座標から指定の(x,y)座標に直線を描画します。
 *              Draws a straight line from the current coordinates to the specified (x, y) coordinates.
 *
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number): void =>
{
    // 現在のパスが存在しない場合はMoveToを実行
    if (!$currentPath.length) {
        pathCommandMoveToUseCase(x, y);
    }

    // 追加する座標が最終の座標と一致する場合は何もしない
    if (pathCommandEqualsToLastPointService(x, y)) {
        return ;
    }

    // 新しいパスに座標を追加
    pathCommandPushPointToCurrentPathService(x, y, false);
};