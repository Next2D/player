import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandPushCurrentPathToVerticesService } from "../service/PathCommandPushCurrentPathToVerticesService";
import { $currentPath } from "../../PathCommand";

/**
 * @description 指定の(x,y)座標に移動となる頂点情報を追加します。
 *              Add vertex information that moves to the specified (x, y) coordinates.
 *
 * @param  {array} current_path
 * @param  {array} vertices
 * @param  {number} x
 * @param  {number} y
 * @return {void}
 * @method
 * @protected
 */
export const execute = (x: number, y: number): void =>
{

    // 現在のパスが存在しない場合は初期処理を行って終了
    if (!$currentPath.length) {
        pathCommandPushPointToCurrentPathService(x, y, false);
        return;
    }

    // 追加する座標が最終の座標と一致する場合は何もしない
    if (pathCommandEqualsToLastPointService(x, y)) {
        return;
    }

    // 現在のパスをverticesに追加して新しいパスを作成
    pathCommandPushCurrentPathToVerticesService();

    // 新しいパスに座標を追加
    pathCommandPushPointToCurrentPathService(x, y, false);
};