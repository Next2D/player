import {
    $currentPath,
    $vertices
} from "../../PathCommand";

/**
 * @description 現在操作中のパス配列を全てverticesに統合します
 *              Integrate all path arrays currently being operated into vertices
 *
 * @return {void}
 * @method
 * @protected
 */
export const execute = (): void =>
{
    // 最低1頂点(3要素)が必要（フィルタリングは$getVerticesで行う）
    if ($currentPath.length < 3) {
        $currentPath.length = 0;
        return ;
    }

    $vertices.push($currentPath.slice(0));
    $currentPath.length = 0;
};