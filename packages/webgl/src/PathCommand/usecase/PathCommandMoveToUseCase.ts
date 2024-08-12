import type { IPath } from "../../interface/IPath";
import { execute as pathCommandPushPointToCurrentPathService } from "../service/PathCommandPushPointToCurrentPathService";
import { execute as pathCommandEqualsToLastPointService } from "../service/PathCommandEqualsToLastPointService";
import { execute as pathCommandPushCurrentPathToVerticesService } from "../service/PathCommandPushCurrentPathToVerticesService";

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
export const execute = (
    current_path: IPath,
    vertices: IPath[],
    x: number,
    y: number
): void => {

    // 現在のパスが存在しない場合は初期処理を行って終了
    if (!current_path.length) {
        pathCommandPushPointToCurrentPathService(current_path, x, y, false);
        return;
    }

    // 追加する座標が最終の座標と一致する場合は何もしない
    if (pathCommandEqualsToLastPointService(current_path, x, y)) {
        return;
    }

    // 現在のパスをverticesに追加して新しいパスを作成
    pathCommandPushCurrentPathToVerticesService(current_path, vertices);

    // 新しいパスに座標を追加
    pathCommandPushPointToCurrentPathService(current_path, x, y, false);
};