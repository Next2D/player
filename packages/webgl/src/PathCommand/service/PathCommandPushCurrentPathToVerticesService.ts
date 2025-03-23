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
    const minVertices = stroke ? 4 : 10;
    if ($currentPath.length < minVertices) {
        $currentPath.length = 0;
        return ;
    }

    $vertices.push($currentPath.slice(0));
    $currentPath.length = 0;
};