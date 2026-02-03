import {
    $currentPath,
    $vertices
} from "../../PathCommand";

/**
 * @description 現在操作中のパス配列を全てverticesに統合します
 *              Integrate all path arrays currently being operated into vertices
 *
 * @param  {boolean} [stroke=false]
 * @return {void}
 * @method
 * @protected
 */
export const execute = (stroke: boolean = false): void =>
{
    // stroke: 最低2頂点(6要素)が必要、fill: 最低3頂点(9要素)が必要
    const minVertices = stroke ? 6 : 9;
    if ($currentPath.length < minVertices) {
        $currentPath.length = 0;
        return ;
    }

    $vertices.push($currentPath.slice(0));
    $currentPath.length = 0;
};